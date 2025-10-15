'server only';
import {Founds} from "@/models/founds";
import {admin} from "@/lib/admin";
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from "firebase-admin/firestore";

export class FoundsConverter implements FirestoreDataConverter<Founds> {
    toFirestore(founds: Founds): Founds {
        return founds;
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<Founds>): Founds {
        return snapshot.data()
    }
}

export async function getFounds() {
    const collection = admin.collection('founds').withConverter(new FoundsConverter());
    const snapshot = await collection.doc('default').get();

    return snapshot.data();
}