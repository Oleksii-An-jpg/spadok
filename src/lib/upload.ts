import { getStorage } from 'firebase-admin/storage';

export async function uploadImageToBucket(file: File) {
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

export async function deleteImageFromBucket(fileName: string) {
    const bucket = getStorage().bucket('spadok-images');
    const fileRef = bucket.file(fileName);

    await fileRef.delete();
}