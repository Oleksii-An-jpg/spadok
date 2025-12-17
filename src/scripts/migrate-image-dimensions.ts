// scripts/migrate-aspect-ratios.ts
import sharp from 'sharp';
import { admin } from '@/lib/admin';
import { getStorage } from 'firebase-admin/storage';
import {ImageDimensions} from "@/lib/upload";

export async function migrateDimensions() {
    const bucket = getStorage().bucket('spadok-images');
    const items = await admin.collection('items').get();

    for (const doc of items.docs) {
        const data = doc.data();
        const dimensions: ImageDimensions[] = [];

        for (const imageName of data.images || []) {
            const file = bucket.file(imageName);
            const [buffer] = await file.download();
            const metadata = await sharp(buffer).metadata();
            dimensions.push({
                width: metadata.width,
                height: metadata.height,
            });
        }

        await doc.ref.update({ imageDimensions: dimensions });
    }
}