'server only';
import {Cut} from "@/models/cut";
import {admin} from "@/lib/admin";
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from "firebase-admin/firestore";

export class CutsConverter implements FirestoreDataConverter<Cut> {
    toFirestore(cut: Cut): Cut {
        return cut;
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<Cut>): Cut {
        return {
            ...snapshot.data(),
            id: snapshot.id
        }
    }
}

export async function getCuts() {
    const snapshot = await admin.collection('cuts').withConverter(new CutsConverter()).get()
    return snapshot.docs.map((doc) => doc.data());
}

export async function getCut(id: string) {
    const doc = await admin.collection('cuts').withConverter(new CutsConverter()).doc(id).get()
    return doc.exists ? doc.data() : null;
}