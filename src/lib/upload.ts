import sharp from 'sharp';
import { getStorage } from 'firebase-admin/storage';

export type ImageDimensions = { width: number; height: number };

export async function uploadImageToBucket(file: File): Promise<{ filename: string; dimensions: ImageDimensions }> {
    const bucket = getStorage().bucket('spadok-images');
    const buffer = Buffer.from(await file.arrayBuffer());

    // Get image dimensions
    const metadata = await sharp(buffer).metadata();
    const dimensions: ImageDimensions = {
        width: metadata.width || 500,
        height: metadata.height || 500
    };

    const fileRef = bucket.file(file.name);

    await fileRef.save(buffer, {
        contentType: file.type,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });

    // Make public
    await fileRef.makePublic();

    return {
        filename: fileRef.name,
        dimensions
    };
}

export async function deleteImageFromBucket(filename: string) {
    const bucket = getStorage().bucket('spadok-images');
    const fileRef = bucket.file(filename);

    try {
        await fileRef.delete();
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}