import {admin} from "@/lib/admin";
import {FieldValue} from 'firebase-admin/firestore'
import {Item} from "@/models/item";

export async function removeDeletedRegionId() {
    const deletedRegionId = 'H3DgNwPizFQIrdZmY2nA';
    const itemsRef = admin.collection('items');

    try {
        // Query documents that contain the deleted region ID
        // Note: Firestore doesn't support direct array-contains queries for removal,
        // so we need to fetch all documents and filter
        const snapshot = await itemsRef.get();

        const batch = admin.batch();
        let updateCount = 0;

        snapshot.forEach((doc) => {
            const data = doc.data();
            let needsUpdate = false;
            const updates: Partial<Item> = {};

            // Check if 'region' array contains the deleted ID
            if (Array.isArray(data.region) && data.region.includes(deletedRegionId)) {
                // @ts-expect-error: array
                updates.region = FieldValue.arrayRemove(deletedRegionId);
                needsUpdate = true;
            }

            // Check if 'regions' array contains the deleted ID
            if (Array.isArray(data.regions) && data.regions.includes(deletedRegionId)) {
                // @ts-expect-error: array
                updates.regions = FieldValue.arrayRemove(deletedRegionId);
                needsUpdate = true;
            }

            if (needsUpdate) {
                batch.update(doc.ref, updates);
                updateCount++;
                console.log(`Queued update for document: ${doc.id}`);
            }
        });

        if (updateCount > 0) {
            await batch.commit();
            console.log(`✅ Successfully updated ${updateCount} documents`);
        } else {
            console.log('No documents needed updating');
        }

    } catch (error) {
        console.error('Error removing region ID:', error);
        throw error;
    }
}