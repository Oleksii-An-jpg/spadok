// lib/algolia.ts
import { algoliasearch } from 'algoliasearch';
import {Item} from "@/models/item";

export const algoliaClient = algoliasearch(
    process.env.ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_KEY!
);

const INDEX_NAME = 'items';

export async function configureAlgoliaIndex() {
    await algoliaClient.setSettings({
        indexName: INDEX_NAME,
        indexSettings: {
            searchableAttributes: [
                'name',
                'description',
                'author',
                'techniques',
                'subRegions',
                'mainCategory',
            ],
            attributesForFaceting: [
                'mainCategory',
                'searchable(region)',
                'searchable(techniques)',
                'searchable(subRegions)',
                'sex',
                'matureness',
                'published',
            ],
            customRanking: ['desc(updatedAt)'],
            highlightPreTag: '<mark>',
            highlightPostTag: '</mark>',
        },
    });
}

// Helper functions
export async function saveItemToAlgolia(itemId: string, itemData: Item) {
    await algoliaClient.saveObject({
        indexName: INDEX_NAME,
        body: {
            objectID: itemId,
            ...itemData,
            _tags: [
                ...(itemData.techniques || []),
                ...(itemData.subRegions || []),
                ...(itemData.region || []),
                itemData.mainCategory,
                ...(itemData.subCategories || []),
            ].filter(Boolean),
        },
    });
}

export async function deleteItemFromAlgolia(id: string) {
    await algoliaClient.deleteObject({
        indexName: INDEX_NAME,
        objectID: id,
    });
}

export async function searchItems(
    query: string,
    filters?: string,
    page: number = 0,
    hitsPerPage: number = 20
) {
    return await algoliaClient.search({
        requests: [
            {
                indexName: INDEX_NAME,
                query,
                filters,
                hitsPerPage,
                page,
                attributesToRetrieve: [],
            },
        ],
    });
}