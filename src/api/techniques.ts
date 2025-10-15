import {Technique} from "@/models/technique";

'server only';
import {admin} from "@/lib/admin";
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from "firebase-admin/firestore";

export class TechniquesConverter implements FirestoreDataConverter<Technique> {
    toFirestore(technique: Technique): Technique {
        return technique;
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<Technique>): Technique {
        return {
            ...snapshot.data(),
            id: snapshot.id
        }
    }
}

export async function getTechniques() {
    const snapshot = await admin.collection('techniques').withConverter(new TechniquesConverter()).get()
    return snapshot.docs.map((doc) => doc.data());
}

export async function getTechnique(id: string) {
    const doc = await admin.collection('techniques').withConverter(new TechniquesConverter()).doc(id).get()
    return doc.exists ? doc.data() : null;
}