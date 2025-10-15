'server only';
import {admin} from "@/lib/admin";
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import {Author} from "@/models/author";

export class AuthorsConverter implements FirestoreDataConverter<Author> {
    toFirestore(author: Author): Author {
        return author;
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<Author>): Author {
        return {
            ...snapshot.data(),
            id: snapshot.id
        }
    }
}

export async function getAuthors() {
    const snapshot = await admin.collection('authors').withConverter(new AuthorsConverter()).get()
    return snapshot.docs.map((doc) => doc.data());
}

export async function getAuthor(id: string) {
    const doc = await admin.collection('authors').withConverter(new AuthorsConverter()).doc(id).get()
    return doc.exists ? doc.data() : null;
}