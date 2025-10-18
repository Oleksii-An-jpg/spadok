// scripts/sync-to-algolia.ts
import { algoliasearch } from 'algoliasearch';
import { getFirestore } from 'firebase-admin/firestore';
import { configureAlgoliaIndex } from '@/lib/algolia';

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

    const records = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            objectID: doc.id,
            ...data,
            _tags: [
                ...(data.techniques || []),
                ...(data.subRegions || []),
                ...(data.region || []),
                data.mainCategory,
                ...(data.subCategories || []),
            ].filter(Boolean),
        };
    });

    console.log(`Syncing ${records.length} items to Algolia...`);

    await algoliaClient.saveObjects({
        indexName: 'items',
        objects: records,
    });

    console.log('Sync complete!');
}

syncFirestoreToAlgolia();