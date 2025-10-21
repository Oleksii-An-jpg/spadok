// lib/algolia.ts
import { algoliasearch } from 'algoliasearch';
import {Item} from "@/models/item";
import {getAuthors} from "@/api/authors";
import {getRegions} from "@/api/regions";
import {getMaterials} from "@/api/materials";
import {getTechniques} from "@/api/techniques";
import {getCategories} from "@/api/categories";
import {getCuts} from "@/api/cuts";

export const algoliaClient = algoliasearch(
    process.env.ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_KEY!
);

const INDEX_NAME = 'items';

// lib/algolia.ts
export async function configureAlgoliaIndex() {
    await algoliaClient.setSettings({
        indexName: INDEX_NAME,
        indexSettings: {
            searchableAttributes: [
                'name',
                'description',
                'authorName',              // Search by author name
                'techniqueNames',          // Search by technique names
                'mainCategoryName',        // Search by category name
                'subCategoryNames',
                'regionNames',
                'subRegionNames',
                'purchase',
            ],
            attributesForFaceting: [
                'searchable(mainCategory)',      // Filter by ID
                'searchable(mainCategoryName)',  // Display name
                'searchable(techniques)',        // Filter by ID
                'searchable(techniqueNames)',    // Display name
                'searchable(region)',
                'searchable(regionNames)',
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

export async function denormalizeItemForAlgolia(id: string, item: Item) {
    const [authors, regions, materials, techniques, categories, cuts] = await Promise.all([getAuthors(), getRegions(), getMaterials(), getTechniques(), getCategories(), getCuts()]);

    // Get names for IDs
    const categoryName = categories.find(({ id }) => id === item?.mainCategory)?.name || '';
    const subCategoryNames = (item.subCategories || [])
        .map((id: string) => categories.find((category) => category.id === id)?.name)
        .filter(Boolean);

    const techniqueNames = (item.techniques || [])
        .map((id: string) => techniques.find((technique) => technique.id === id)?.name)
        .filter(Boolean);

    const author = authors.find((author) => author.id === item.author);
    const authorName = author ? `${author.firstName} ${author.lastName}` : '';

    const regionNames = (item.region || [])
        .map((id: string) => regions.find(region => region.id === id)?.name)
        .filter(Boolean);

    const subRegionNames = (item.subRegions || [])
        .map((id: string) => regions.find(region => region.id === id)?.name)
        .filter(Boolean);

    const materialNames = (item.materials || [])
        .map((id: string) => materials.find(material => material.id === id)?.name)
        .filter(Boolean);

    const cutNames = (item.cuts || [])
        .map((id: string) => cuts.find(cut => cut.id === id)?.name)
        .filter(Boolean);

    return {
        objectID: id,

        // Keep original IDs for filtering
        mainCategory: item.mainCategory,
        subCategories: item.subCategories || [],
        techniques: item.techniques || [],
        author: item.author,
        region: item.region || [],
        subRegions: item.subRegions || [],

        // Add searchable names
        mainCategoryName: categoryName,
        subCategoryNames,
        techniqueNames,
        authorName,
        regionNames,
        subRegionNames,
        materialNames,
        cutNames,

        // Include all searchable text fields
        name: item.name,
        description: item.description,
        purchase: item.purchase,

        // Other fields
        sex: item.sex || [],
        price: item.price,
        matureness: item.matureness || [],
        sourceURL: item.sourceURL,
        size: item.size,
        materials: item.materials || [],
        cuts: item.cuts || [],
        published: item.published,

        // Combined tags for easy filtering
        _tags: [
            categoryName,
            ...subCategoryNames,
            ...techniqueNames,
            ...regionNames,
            ...subRegionNames,
            ...materialNames,
            ...cutNames
        ].filter(Boolean),
    };
}

// Helper functions
export async function saveItemToAlgolia(id: string, item: Item) {
    await algoliaClient.saveObject({
        indexName: INDEX_NAME,
        body: await denormalizeItemForAlgolia(id, item),
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