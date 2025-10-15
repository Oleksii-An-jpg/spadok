'server only';
import {admin} from "@/lib/admin";
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import {Material} from "@/models/material";

export class MaterialsConverter implements FirestoreDataConverter<Material> {
    toFirestore(material: Material): Material {
        return material;
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<Material>): Material {
        return {
            ...snapshot.data(),
            id: snapshot.id
        }
    }
}

export async function getMaterials() {
    const snapshot = await admin.collection('materials').withConverter(new MaterialsConverter()).get()
    return snapshot.docs.map((doc) => doc.data());
}

export async function getMaterial(id: string) {
    const doc = await admin.collection('materials').withConverter(new MaterialsConverter()).doc(id).get()
    return doc.exists ? doc.data() : null;
}