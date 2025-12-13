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

async function processImages(
    newImages: File[],
    existingImages: string[] = []
): Promise<string[]> {
    const result: string[] = [];

    for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];

        // If it's an empty file or placeholder, use existing image if available
        if (file.size === 0 && existingImages[i]) {
            result.push(existingImages[i]);
        } else if (file.size > 0) {
            // Upload new image
            const uploadedUrl = await uploadImageToBucket(file);
            result.push(uploadedUrl);

            // Delete old image if it exists and is different
            if (existingImages[i] && existingImages[i] !== uploadedUrl) {
                await deleteImageFromBucket(existingImages[i]);
            }
        }
    }

    // If there are fewer new images than existing, keep the remaining existing ones
    if (newImages.length < existingImages.length) {
        result.push(...existingImages.slice(newImages.length));
    }

    return result;
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const regions = await getRegions()

    // Extract images
    const images = formData.getAll('images') as File[];
    const illustrations = formData.getAll('illustrations') as File[];

    const itemId = formData.get('id') as string | null;

    // Get existing item if updating
    let existingItem: Item | null = null;
    if (itemId) {
        const collection = admin.collection('items').withConverter(new ItemConverter(regions));
        const doc = await collection.doc(itemId).get();
        if (doc.exists) {
            existingItem = doc.data() as Item;
        }
    }

    // Parse form data
    const data = {
        id: itemId,
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
        images: await processImages(images, existingItem?.images || []),
        illustrations: await processImages(illustrations, existingItem?.illustrations || []),
    };

    const item = removeUndefined(data);

    const collection = admin.collection('items').withConverter(new ItemConverter(regions));

    if (itemId && existingItem) {
        await collection.doc(itemId).set(item as Item, { merge: true });
        await saveItemToAlgolia(itemId, item as Item);
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

export async function PATCH(request: NextRequest) {
    const body: Item = await request.json();
    const id = body.id ? String(body.id as string) : null;
    const regions = await getRegions();
    if (!id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const collection = admin.collection('items').withConverter(new ItemConverter(regions));
    const doc = await collection.doc(id).get();

    if (!doc.exists) {
        return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    await collection.doc(id).update(body);

    return NextResponse.json({ success: true });
}