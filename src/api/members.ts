'server only';
import {admin} from "@/lib/admin";
import {
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import {Member} from "@/models/member";

export class MembersConverter implements FirestoreDataConverter<Member> {
    toFirestore(member: Member): Member {
        return member;
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<Member>): Member {
        return {
            ...snapshot.data(),
            id: snapshot.id
        }
    }
}

export async function getMembers() {
    const snapshot = await admin.collection('members').withConverter(new MembersConverter()).get()
    // sorting in memory keeps members without an order (freshly imported ones) in the list
    return snapshot.docs.map((doc) => doc.data()).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getMember(id: string) {
    const doc = await admin.collection('members').withConverter(new MembersConverter()).doc(id).get()
    return doc.exists ? doc.data() : null;
}

export async function getNextMemberOrder() {
    const snapshot = await admin.collection('members').withConverter(new MembersConverter()).get();
    return snapshot.docs.reduce((max, doc) => Math.max(max, doc.data().order ?? 0), -1) + 1;
}

export async function reorderMembers(ids: string[]) {
    const collection = admin.collection('members').withConverter(new MembersConverter());
    const batch = admin.batch();

    ids.forEach((id, order) => {
        batch.update(collection.doc(id), { order });
    });

    return await batch.commit();
}
