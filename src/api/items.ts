import {getRegions} from "@/api/regions";

'server only';
import {Item, ItemDBModel} from "@/models/item";
import {admin} from "@/lib/admin";
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import {Region} from "@/models/region";
import {UniqueIdentifier} from "@dnd-kit/core";
import {getTextFromAddress} from "@/components/places/utils";
import {extractCenturyPartAndFraction} from "@/lib/utils";

function isDefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

export class ItemConverter implements FirestoreDataConverter<Item> {
    private readonly regions: Region[];
    constructor(regions: Region[]) {
        this.regions = regions;
    }

    toFirestore(item: Item): Item {
        return item;
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

export async function getItems() {
    const regions = await getRegions();
    const orderSnapshot = await admin.collection('order').withConverter({
        fromFirestore(snapshot: QueryDocumentSnapshot<{
            items: string[]
        }>): UniqueIdentifier[] {
            return snapshot.data().items;
        },
        toFirestore(items: string[]): string[] {
            return items;
        }
    }).doc('default').get();
    const order = (orderSnapshot.data() || []);
    const position = new Map(order.map((id, index) => [id, index]));
    const collection = admin.collection('items').withConverter(new ItemConverter(regions));
    const snapshot = await collection.get();
    const items = snapshot.docs.map((doc) => doc.data()).sort((a, b) => {
        const posA = position.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const posB = position.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        return posA - posB;
    });
    return {
        items,
        order
    };
}