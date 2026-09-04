import { NextRequest, NextResponse } from 'next/server';
import {admin} from "@/lib/admin";
import {getNextMemberOrder, MembersConverter} from "@/api/members";
import {Member} from "@/models/member";
import {deleteImageFromBucket, uploadImageToBucket} from "@/lib/upload";

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const photo = formData.get('photo');
    const id = formData.get('id');

    const uploaded = photo instanceof File && photo.size > 0 ? await uploadImageToBucket(photo) : null;

    const data = {
        name: String(formData.get('name') ?? ''),
        role: String(formData.get('role') ?? ''),
        description: String(formData.get('description') ?? ''),
        instagram: String(formData.get('instagram') ?? ''),
        ...(uploaded && {
            photo: uploaded.filename,
        })
    }

    const collection = admin.collection('members').withConverter(new MembersConverter());
    const doc = typeof id === 'string' && id ? await collection.doc(id).get() : null;

    if (doc && doc.exists && typeof id === 'string') {
        await collection.doc(id).set(data as Member, { merge: true });

        return NextResponse.json({ success: true, data: { ...data, id } });
    }

    const order = await getNextMemberOrder();
    const created = await collection.add({ ...data, order } as Member);

    return NextResponse.json({ success: true, data: { ...data, order, id: created.id } });
}

export async function DELETE(request: NextRequest) {
    const body: Member = await request.json();
    if (!body.id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const collection = admin.collection('members').withConverter(new MembersConverter());
    const doc = await collection.doc(body.id).get();

    if (!doc.exists) {
        return NextResponse.json({ success: false, message: 'Member not found' }, { status: 404 });
    }

    await collection.doc(body.id).delete();

    // photos kept in /public are shared with the repo, only bucket uploads are ours to remove
    const photo = doc.data()?.photo;
    if (photo && !photo.startsWith('/') && !photo.startsWith('http')) {
        await deleteImageFromBucket(photo);
    }

    return NextResponse.json({ success: true });
}
