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

async function getOrderAndPosition() {
    const orderSnapshot = await admin.collection('order').withConverter({
        fromFirestore(snapshot): UniqueIdentifier[] {
            return snapshot.data().items;
        },
        toFirestore(items: string[]) {
            return items;
        }
    }).doc('default').get();

    const order = (orderSnapshot.data() || []);
    const position = new Map(order.map((id, index) => [id, index]));

    return { order, position };
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

    const batchSize = 30;
    const batches: UniqueIdentifier[][] = [];

    for (let i = 0; i < itemIdsToFetch.length; i += batchSize) {
        batches.push(itemIdsToFetch.slice(i, i + batchSize));
    }

    const snapshots = await Promise.all(
        batches.map(batch =>
            collection.where(FieldPath.documentId(), 'in', batch).get()
        )
    );

    const allDocs = snapshots.flatMap(snap => snap.docs);
    const docsMap = new Map<UniqueIdentifier, Item>(allDocs.map(doc => {
        return [doc.id, doc.data()];
    }));

    const items = itemIdsToFetch
        .map(id => docsMap.get(id))
        .filter((item): item is Item => item !== undefined);

    return { items, order };
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