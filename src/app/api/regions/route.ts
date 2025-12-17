import { NextRequest, NextResponse } from 'next/server';
import {admin} from "@/lib/admin";
import {RegionConverter} from "@/api/regions";
import {Region} from "@/models/region";
import {deleteImageFromBucket, uploadImageToBucket} from "@/lib/upload";
import {Category} from "@/models/category";

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const highlight = formData.get('highlight') as File

    const { filename } = await uploadImageToBucket(highlight);

    const data = {
        id: formData.get('id'),
        name: formData.get('name'),
        description: formData.get('description'),
        isCollection: formData.get('isCollection') === 'true',
        canFilter: formData.get('canFilter') === 'true',
        ...(highlight && {
            highlight: filename,
        })
    }

    const collection = admin.collection('regions').withConverter(new RegionConverter());

    const doc = typeof data.id === 'string' && await collection.doc(data.id).get();

    const { id, ...category } = data;

    if (typeof data.id === 'string' && doc && doc.exists) {
        await collection.doc(data.id).set(category as Category, { merge: true });
    } else {
        await collection.add(category as Category);
    }

    return NextResponse.json({ success: true, data });
}

export async function DELETE(request: NextRequest) {
    const body: Region = await request.json();
    if (!body.id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const collection = admin.collection('regions').withConverter(new RegionConverter());
    const doc = await collection.doc(body.id).get();

    if (!doc.exists) {
        return NextResponse.json({ success: false, message: 'Cut not found' }, { status: 404 });
    }

    if (body.highlight) {
        await deleteImageFromBucket(body.highlight)
    }

    await collection.doc(body.id).delete();

    return NextResponse.json({ success: true });
}