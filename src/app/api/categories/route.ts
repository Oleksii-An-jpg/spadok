import { NextRequest, NextResponse } from 'next/server';
import {admin} from "@/lib/admin";
import {CategoriesConverter} from "@/api/categories";
import {Category} from "@/models/category";
import {deleteImageFromBucket, uploadImageToBucket} from "@/lib/upload";

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const highlight = formData.get('highlight') as File

    const data = {
        id: formData.get('id'),
        name: formData.get('name'),
        description: formData.get('description'),
        isCollection: formData.get('isCollection') === 'true',
        isHomepage: formData.get('isHomepage') === 'true',
        canFilter: formData.get('canFilter') === 'true',
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

export async function DELETE(request: NextRequest) {
    const body: Category = await request.json();
    if (!body.id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const collection = admin.collection('categories').withConverter(new CategoriesConverter());
    const doc = await collection.doc(body.id).get();

    if (!doc.exists) {
        return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    await collection.doc(body.id).delete();

    if (body.highlight) {
        await deleteImageFromBucket(body.highlight)
    }

    return NextResponse.json({ success: true });
}