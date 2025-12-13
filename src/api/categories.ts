'server only';
import {admin} from "@/lib/admin";
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
    Filter,
    Query
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



export async function getCategories({ filters }: { filters?: Array<Filter> } = { filters: [] }) {
    let query: Query<Category> = admin.collection('categories').withConverter(new CategoriesConverter());

    filters?.forEach((filter) => {
        query = query.where(filter);
    });

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data());
}

export async function getCategory(id: string) {
    const doc = await admin.collection('categories').withConverter(new CategoriesConverter()).doc(id).get()
    return doc.exists ? doc.data() : null;
}