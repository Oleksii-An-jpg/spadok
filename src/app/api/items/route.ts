// app/api/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {admin} from "@/lib/admin";
import {ItemConverter} from "@/api/items";
import {getRegions} from "@/api/regions";
import {Item} from "@/models/item";
import {saveItemToAlgolia} from "@/lib/algolia";
import {deleteImageFromBucket, uploadImageToBucket} from "@/lib/upload";

function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v != undefined && !Number.isNaN(v))
    ) as Partial<T>;
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const regions = await getRegions()

    // Extract images
    const images = formData.getAll('images') as File[];

    // Parse form data
    const data = {
        id: formData.get('id'),
        name: formData.get('name'),
        description: formData.get('description'),
        purchase: formData.get('purchase'),
        subRegions: JSON.parse(formData.get('subRegions') as string),
        regionOfUse: JSON.parse(formData.get('regionOfUse') as string),
        sex: JSON.parse(formData.get('sex') as string),
        techniques: JSON.parse(formData.get('techniques') as string),
        mainCategory: formData.get('mainCategory'),
        subCategories: formData.get('subCategories')
            ? JSON.parse(formData.get('subCategories') as string)
            : null,
        price: formData.get('price') ? Number(formData.get('price')) : null,
        matureness: formData.get('matureness')
            ? JSON.parse(formData.get('matureness') as string)
            : null,
        sourceURL: formData.get('sourceURL'),
        size: formData.get('size') || null,
        address: formData.get('address')
            ? JSON.parse(formData.get('address') as string)
            : null,
        materials: formData.get('materials')
            ? JSON.parse(formData.get('materials') as string)
            : null,
        author: formData.get('author'),
        cuts: JSON.parse(formData.get('cuts') as string),
        published: formData.get('published') === 'true',
        region: JSON.parse(formData.get('region') as string),
        regions: JSON.parse(formData.get('regions') as string),
        date: JSON.parse(formData.get('date') as string),
        images: await Promise.all(images.map(uploadImageToBucket))
    };

    const item = removeUndefined(data);

    const collection = admin.collection('items').withConverter(new ItemConverter(regions));

    const doc = typeof item.id === 'string' && await collection.doc(item.id).get();

    if (typeof item.id === 'string' && doc && doc.exists) {
        await collection.doc(item.id).set(item as Item, { merge: true });
        await saveItemToAlgolia(item.id, item as Item);
    } else {
        const { id, ...rest } = item;
        const ref = await collection.add(rest as Item);
        await saveItemToAlgolia(ref.id, rest as Item);
    }

    return NextResponse.json({ success: true, data: item });
}

export async function DELETE(request: NextRequest) {
    const body: Item = await request.json();
    const id = body.id ? String(body.id as string) : null;
    const regions = await getRegions();
    if (!id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const collection = admin.collection('items').withConverter(new ItemConverter(regions));
    const doc = await collection.doc(id).get();

    if (!doc.exists) {
        return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    await collection.doc(id).delete();

    if (body.images?.length) {
        await Promise.all(body.images.map(async image => {
            await deleteImageFromBucket(image)
        }))
    }

    return NextResponse.json({ success: true });
}