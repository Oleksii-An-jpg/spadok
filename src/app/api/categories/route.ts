import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from 'firebase-admin/storage';
import {admin} from "@/lib/admin";
import {CategoriesConverter} from "@/api/categories";
import {Category} from "@/models/category";

async function uploadImageToBucket(file: File) {
    const bucket = getStorage().bucket('spadok-images');
    const buffer = Buffer.from(await file.arrayBuffer());

    const fileRef = bucket.file(file.name);

    await fileRef.save(buffer, {
        contentType: file.type,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });

    // Make public
    await fileRef.makePublic();

    return fileRef.name;
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const highlight = formData.get('highlight') as File

    const data = {
        id: formData.get('id'),
        name: formData.get('name'),
        description: formData.get('description'),
        ...(highlight && {
            highlight: await uploadImageToBucket(highlight),
        })
    }

    const collection = admin.collection('categories').withConverter(new CategoriesConverter());

    const doc = typeof data.id === 'string' && await collection.doc(data.id).get();

    const { id, ...category } = data;

    if (typeof data.id === 'string' && doc && doc.exists) {
        await collection.doc(data.id).set(category as Category, { merge: true });
    } else {
        await collection.add(category as Category);
    }

    return NextResponse.json({ success: true, data });
}