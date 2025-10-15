import {Region} from "@/models/region";

'server only';
import {admin} from "@/lib/admin";
import {
    FirestoreDataConverter,
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

export async function getRegions() {
    const snapshot = await admin.collection('regions').withConverter(new RegionConverter()).get()
    return snapshot.docs.map((doc) => doc.data());
}

export async function getRegion(id: string) {
    const doc = await admin.collection('regions').withConverter(new RegionConverter()).doc(id).get()
    return doc.exists ? doc.data() : null;
}