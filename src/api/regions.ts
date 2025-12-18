import {Region} from "@/models/region";

'server only';
import {admin} from "@/lib/admin";
import {
    Filter,
    FirestoreDataConverter, Query,
    QueryDocumentSnapshot,
} from "firebase-admin/firestore";

export class RegionConverter implements FirestoreDataConverter<Region> {
    toFirestore(region: Region): Region {
        return region;
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<Region>): Region {
        return {
            ...snapshot.data(),
            id: snapshot.id
        }
    }
}

export async function getRegions({ filters }: { filters?: Array<Filter> } = { filters: [] }) {
    let query: Query<Region> = admin.collection('regions').withConverter(new RegionConverter());

    filters?.forEach((filter) => {
        query = query.where(filter);
    });

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data());
}

export async function getRegion(id: string) {
    const doc = await admin.collection('regions').withConverter(new RegionConverter()).doc(id).get()
    return doc.exists ? doc.data() : null;
}