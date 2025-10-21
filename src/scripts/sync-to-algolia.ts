// scripts/sync-to-algolia.ts
import { algoliasearch } from 'algoliasearch';
import { getFirestore } from 'firebase-admin/firestore';
import { configureAlgoliaIndex, denormalizeItemForAlgolia } from '@/lib/algolia';
import {Item} from "@/models/item";

const algoliaClient = algoliasearch(
    process.env.ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_KEY!
);

async function syncFirestoreToAlgolia() {
    console.log('Configuring Algolia index...');
    await configureAlgoliaIndex();

    console.log('Fetching items from Firestore...');
    const db = getFirestore();
    const snapshot = await db.collection('items').get();

    const recordPromises = snapshot.docs.map(async (doc) => {
        const data = doc.data();
        return denormalizeItemForAlgolia(doc.id, data as Item);
    });

    const records = await Promise.all(recordPromises);

    console.log(`Syncing ${records.length} items to Algolia...`);

    await algoliaClient.saveObjects({
        indexName: 'items',
        objects: records,
    });

    console.log('Sync complete!');
}

syncFirestoreToAlgolia();