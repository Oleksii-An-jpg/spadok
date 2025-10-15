'server only';
import {admin} from "@/lib/admin";
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import {Category} from "@/models/category";

export class CategoriesConverter implements FirestoreDataConverter<Category> {
    toFirestore(category: Category): Category {
        return category;
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<Category>): Category {
        return {
            ...snapshot.data(),
            id: snapshot.id
        }
    }
}

export async function getCategories() {
    const snapshot = await admin.collection('categories').withConverter(new CategoriesConverter()).get()
    return snapshot.docs.map((doc) => doc.data());
}

export async function getCategory(id: string) {
    const doc = await admin.collection('categories').withConverter(new CategoriesConverter()).doc(id).get()
    return doc.exists ? doc.data() : null;
}