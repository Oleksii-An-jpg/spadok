// app/api/admin/sync-algolia/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { algoliaClient, configureAlgoliaIndex, denormalizeItemForAlgolia } from '@/lib/algolia';
import {Item} from "@/models/item";

export async function POST(request: NextRequest) {
    try {
        console.log('Configuring Algolia index...');
        await configureAlgoliaIndex();

        console.log('Fetching items from Firestore...');
        const db = getFirestore();
        const snapshot = await db.collection('items').get();

        console.log('Denormalizing items...');
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

        return NextResponse.json({
            success: true,
            synced: records.length,
            message: `Successfully synced ${records.length} items to Algolia`
        });

    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}