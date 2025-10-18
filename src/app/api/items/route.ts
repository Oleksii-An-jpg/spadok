// app/api/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from 'firebase-admin/storage';
import {admin} from "@/lib/admin";
import {ItemConverter} from "@/api/items";
import {getRegions} from "@/api/regions";
import {Item} from "@/models/item";
import {saveItemToAlgolia} from "@/lib/algolia";

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

    return NextResponse.json({ success: true, item });
}