import isDefined from "@/utils/isDefined";

'server only';
import {getRegions} from "@/api/regions";
import {Item, ItemDBModel} from "@/models/item";
import {admin} from "@/lib/admin";
import {FirestoreDataConverter, QueryDocumentSnapshot,FieldValue} from "firebase-admin/firestore";
import {Region} from "@/models/region";
import {UniqueIdentifier} from "@dnd-kit/core";
import {getTextFromAddress} from "@/components/places/utils";
import {extractCenturyPartAndFraction, getDateTupleFromExtractedInfo} from "@/lib/utils";
import { FieldPath } from 'firebase-admin/firestore';
import {Relation} from "@/models/relation";

export class RelationConverter implements FirestoreDataConverter<Relation> {
    fromFirestore(snapshot: QueryDocumentSnapshot<Relation>): Relation {
        return {
            ...snapshot.data(),
            id: snapshot.id
        }
    }
    toFirestore(relation: Relation): Relation {
        return relation
    }
}

export class ItemConverter implements FirestoreDataConverter<Item> {
    private readonly regions: Region[];
    constructor(regions: Region[]) {
        this.regions = regions;
    }

    toFirestore(item: Item): ItemDBModel {
        const { date, ...rest } = item;
        const tuple = getDateTupleFromExtractedInfo(date);
        return {
            ...rest,
            date: tuple ? tuple.map(d => d.toISOString()) : [],
        };
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<ItemDBModel>): Item {
        const { region, address, date, sex, ...rest } = snapshot.data();
        const r = (region || []).map(id => this.regions.find(r => r.id === id)).filter(isDefined);
        return {
            ...rest,
            id: snapshot.id,
            ...(address && {
                address: {
                    ...address,
                    line: getTextFromAddress(address)
                }
            }),
            sex: sex === null ? [] : sex,
            date: extractCenturyPartAndFraction(date.map(d => new Date(d))),
            region: r.map(r => r.id),
            regions: r
        }
    }
}

export async function getItem(id: string) {
    if (!id) {
        return;
    }
    const regions = await getRegions();
    const doc = await admin.collection('items').withConverter(new ItemConverter(regions)).doc(id).get();
    return doc.data();
}

const ORDER_COLLECTION = 'order';
const ORDER_DOCUMENT = 'default';

// Firestore caps `in` queries at 30 values, so a page wider than that is fetched
// in parallel chunks.
const ID_BATCH_SIZE = 30;

type Order = { items: UniqueIdentifier[] };

const orderConverter: FirestoreDataConverter<Order> = {
    fromFirestore(snapshot: QueryDocumentSnapshot<Order>): Order {
        return { items: snapshot.data().items ?? [] };
    },
    toFirestore(order: Order): Order {
        return order;
    },
};

function getOrderRef() {
    return admin.collection(ORDER_COLLECTION).doc(ORDER_DOCUMENT).withConverter(orderConverter);
}

function chunk<T>(list: T[], size: number): T[][] {
    const batches: T[][] = [];

    for (let i = 0; i < list.length; i += size) {
        batches.push(list.slice(i, i + size));
    }

    return batches;
}

/** Pure splice-based move, so the server does not have to pull in dnd-kit. */
function move<T>(list: T[], from: number, to: number): T[] {
    const next = [...list];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
}

async function getOrderAndPosition() {
    const orderSnapshot = await getOrderRef().get();

    const order = orderSnapshot.data()?.items ?? [];
    const position = new Map(order.map((id, index) => [id, index]));

    return { order, position };
}

/**
 * Reads exactly the documents named by `ids`, keeping their sequence and
 * silently dropping ids with no document behind them.
 */
async function getItemsByIds(ids: UniqueIdentifier[]) {
    if (!ids.length) return [];

    const regions = await getRegions();
    const collection = admin.collection('items').withConverter(new ItemConverter(regions));

    const snapshots = await Promise.all(
        chunk(ids, ID_BATCH_SIZE).map(batch =>
            collection.where(FieldPath.documentId(), 'in', batch).get()
        )
    );

    const docs = new Map<UniqueIdentifier, Item>(
        snapshots.flatMap(snapshot => snapshot.docs).map(doc => [doc.id, doc.data()])
    );

    return ids.map(id => docs.get(id)).filter(isDefined);
}

export async function setOrderAndPosition(id: string) {
    const orderRef = getOrderRef();

    await admin.runTransaction(async (tx) => {
        const snap = await tx.get(orderRef);

        const items = snap.exists ? [...snap.data()!.items] : [];

        // true unshift
        items.unshift(id);

        tx.set(orderRef, { items }, { merge: true });
    });
}

/** Drops ids from the order, e.g. once the document behind them is gone. */
export async function removeFromOrder(...ids: UniqueIdentifier[]) {
    if (!ids.length) return;

    await getOrderRef().update({ items: FieldValue.arrayRemove(...ids) });
}

type Move = {
    /** The item being moved. */
    activeId: UniqueIdentifier;
    /** Drop target — the moved item takes this item's place. */
    overId?: UniqueIdentifier;
    /** Relative move, used by the up/down buttons; ignored when `overId` is set. */
    delta?: number;
};

/**
 * Moves a single item inside the canonical order.
 *
 * The whole read-modify-write happens in one transaction against the order
 * document, so two editors reordering at the same time cannot clobber each
 * other the way sending a full client-side sequence would.
 */
export async function moveItem({ activeId, overId, delta = 0 }: Move) {
    const orderRef = getOrderRef();

    return await admin.runTransaction(async (tx) => {
        const snap = await tx.get(orderRef);

        if (!snap.exists) {
            throw new Error('Order document does not exist.');
        }

        const items = snap.data()!.items;
        const from = items.indexOf(activeId);

        if (from === -1) {
            throw new Error(`Item ${activeId} is not part of the order.`);
        }

        const target = overId !== undefined ? items.indexOf(overId) : from + delta;

        if (target === -1) {
            throw new Error(`Item ${overId} is not part of the order.`);
        }

        const to = Math.min(Math.max(target, 0), items.length - 1);

        if (to === from) return items;

        const next = move(items, from, to);

        tx.set(orderRef, { items: next }, { merge: true });

        return next;
    });
}

type WhereFilter = {
    field: string | FirebaseFirestore.FieldPath;
    operator: FirebaseFirestore.WhereFilterOp;
    value: unknown;
};

type Options = {
    limit?: number;
    where?: WhereFilter | WhereFilter[];
};

export async function getItems(options?: Options) {
    const regions = await getRegions();
    const { order, position } = await getOrderAndPosition();

    const collection = admin.collection('items').withConverter(new ItemConverter(regions));

    // Handle custom where filters
    if (options?.where) {
        const filters = Array.isArray(options.where) ? options.where : [options.where];

        let query: FirebaseFirestore.Query<Item> = collection;

        // Apply all where filters
        for (const filter of filters) {
            query = query.where(filter.field, filter.operator, filter.value);
        }

        // Apply limit if specified
        if (options?.limit) {
            query = query.limit(options.limit);
        }

        const snapshot = await query.get();
        const items = snapshot.docs
            .map((doc) => doc.data())
            .sort((a, b) => {
                const posA = position.get(a.id) ?? Number.MAX_SAFE_INTEGER;
                const posB = position.get(b.id) ?? Number.MAX_SAFE_INTEGER;
                return posA - posB;
            });

        return { items, order };
    }

    // Default: no filter - use order array
    const itemIdsToFetch = options?.limit
        ? order.slice(0, options.limit)
        : order;

    const items = await getItemsByIds(itemIdsToFetch);

    return { items, order };
}

export type ItemsPage = {
    items: Item[];
    /** Zero-based, already clamped to the available pages. */
    page: number;
    pageSize: number;
    /** Number of items in the whole (optionally narrowed) list. */
    total: number;
    pageCount: number;
};

type PageOptions = {
    page: number;
    pageSize: number;
    /**
     * Narrows the list to these ids, e.g. the hits of a search. The manual
     * order still decides the sequence, so ids outside it are dropped.
     */
    ids?: UniqueIdentifier[];
};

/**
 * Reads a single page of items.
 *
 * The order document holds the canonical sequence of ids, so the page window
 * can be sliced before touching the items collection: one read for the order
 * plus one `in` query per 30 ids on the page, instead of the whole collection.
 */
export async function getItemsPage({ page, pageSize, ids }: PageOptions): Promise<ItemsPage> {
    const { order, position } = await getOrderAndPosition();

    const sequence = ids
        ? ids.filter(id => position.has(id)).sort((a, b) => position.get(a)! - position.get(b)!)
        : order;

    const total = sequence.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const index = Math.min(Math.max(page, 0), pageCount - 1);

    const window = sequence.slice(index * pageSize, index * pageSize + pageSize);
    const items = await getItemsByIds(window);

    // Ids left behind by deletes that predate order pruning would otherwise
    // keep inflating the count and short-changing this page forever; drop them
    // as we come across them. `total` corrects itself on the next read.
    if (items.length !== window.length) {
        const found = new Set(items.map(item => item.id));
        await removeFromOrder(...window.filter(id => !found.has(id)));
    }

    return { items, page: index, pageSize, total, pageCount };
}

export async function getItemsByCategory(category: string, options?: { limit?: number }) {
    const regions = await getRegions();
    const { order, position } = await getOrderAndPosition();

    const collection = admin.collection('items').withConverter(new ItemConverter(regions));

    // Firestore doesn't support OR directly, so we do two queries
    const [mainSnap, subSnap] = await Promise.all([
        collection.where('mainCategory', '==', category).get(),
        collection.where('subCategories', 'array-contains', category).get(),
    ]);

    // Merge and deduplicate by id
    const allDocs = new Map<string, FirebaseFirestore.QueryDocumentSnapshot<Item>>();
    for (const doc of [...mainSnap.docs, ...subSnap.docs]) {
        allDocs.set(doc.id, doc);
    }

    let items = Array.from(allDocs.values())
        .map((doc) => doc.data())
        .sort((a, b) => {
            const posA = position.get(a.id) ?? Number.MAX_SAFE_INTEGER;
            const posB = position.get(b.id) ?? Number.MAX_SAFE_INTEGER;
            return posA - posB;
        });

    if (options?.limit) {
        items = items.slice(0, options.limit);
    }

    return { items, order };
}

export async function getItemsByRegion(region: string, options?: { limit?: number }) {
    const regions = await getRegions();
    const { order, position } = await getOrderAndPosition();

    const collection = admin.collection('items').withConverter(new ItemConverter(regions));

    // Firestore doesn't support OR directly, so we do two queries
    const [mainSnap, subSnap] = await Promise.all([
        collection.where('region', 'array-contains', region).get(),
        collection.where('subRegions', 'array-contains', region).get(),
    ]);

    // Merge and deduplicate by id
    const allDocs = new Map<string, FirebaseFirestore.QueryDocumentSnapshot<Item>>();
    for (const doc of [...mainSnap.docs, ...subSnap.docs]) {
        allDocs.set(doc.id, doc);
    }

    let items = Array.from(allDocs.values())
        .map((doc) => doc.data())
        .sort((a, b) => {
            const posA = position.get(a.id) ?? Number.MAX_SAFE_INTEGER;
            const posB = position.get(b.id) ?? Number.MAX_SAFE_INTEGER;
            return posA - posB;
        });

    if (options?.limit) {
        items = items.slice(0, options.limit);
    }

    return { items, order };
}

export async function updateSubcategoryAssignments(
    category: string,
    items: string[]
) {
    const regions = await getRegions();
    const collection = admin.collection('items').withConverter(new ItemConverter(regions));

    // Get all items that currently have this category
    const { items: currentItems } = await getItemsByCategory(category);
    const currentItemIds = new Set(currentItems.map(item => String(item.id)));
    const checkedItemIdsSet = new Set(items);

    // Determine which items to add and remove
    const itemsToAdd = items.filter(id => !currentItemIds.has(id));
    const itemsToRemove = Array.from(currentItemIds).filter(id => !checkedItemIdsSet.has(id));

    // Process additions and removals in batches
    const batchSize = 500;
    let totalUpdated = 0;

    // Add category to checked items that don't have it
    if (itemsToAdd.length > 0) {
        for (let i = 0; i < itemsToAdd.length; i += batchSize) {
            const batch = itemsToAdd.slice(i, i + batchSize);
            const writeBatch = admin.batch();

            for (const itemId of batch) {
                const docRef = collection.doc(itemId);
                writeBatch.update(docRef, {
                    subCategories: FieldValue.arrayUnion(category)
                });
            }

            await writeBatch.commit();
            totalUpdated += batch.length;
        }
    }

    // Remove category from unchecked items that have it
    if (itemsToRemove.length > 0) {
        for (let i = 0; i < itemsToRemove.length; i += batchSize) {
            const batch = itemsToRemove.slice(i, i + batchSize);
            const writeBatch = admin.batch();

            for (const itemId of batch) {
                const docRef = collection.doc(itemId);
                writeBatch.update(docRef, {
                    subCategories: FieldValue.arrayRemove(category)
                });
            }

            await writeBatch.commit();
            totalUpdated += batch.length;
        }
    }

    return {
        success: true,
        category,
        added: itemsToAdd.length,
        removed: itemsToRemove.length,
        totalUpdated
    };
}

export async function getRelation(id: string) {
    const doc = await admin.collection('related-items').withConverter(new RelationConverter()).doc(id).get()

    return doc.data();
}