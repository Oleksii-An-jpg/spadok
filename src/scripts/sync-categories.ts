import {CategoriesConverter, getCategories} from "@/api/categories";
import {getItems} from "@/api/items";
import {generateCategoryHighlight} from "@/lib/collage";
import {getStorage} from "firebase-admin/storage";
import {admin} from "@/lib/admin";

async function uploadBufferToBucket(buffer: Buffer, fileName: string) {
    const bucket = getStorage().bucket('spadok-images');
    const fileRef = bucket.file(fileName);

    await fileRef.save(buffer, {
        contentType: 'image/jpeg',
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });

    await fileRef.makePublic();
    return fileRef.name;
}

export async function syncCategories() {
    const categories = await getCategories();
    const {items} = await getItems();
    const collection = admin.collection('categories').withConverter(new CategoriesConverter());
    const withItems = categories.map(category => ({
        ...category,
        items: items.filter(item => item.mainCategory === category.id || item.subCategories?.includes(category.id)),
    })).filter(category => category.items.length > 3);

    await Promise.all(withItems.map(async (category) => {
        const base = await generateCategoryHighlight(category)
        await uploadBufferToBucket(base, `${category.id}.jpg`);
        await collection.doc(category.id).update({
            highlight: `${category.id}.jpg`
        });
    }));
}