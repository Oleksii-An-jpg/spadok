'use server';

import {getItemsPage} from "@/api/items";
import Items from "@/components/items";
import {DEFAULT_PAGE_SIZE, PAGE_SIZES} from "@/lib/pagination";
import {Card, Heading, VStack} from "@chakra-ui/react";
import Create from "@/components/exhibition/create";
import {getRegions} from "@/api/regions";
import {getAuthors} from "@/api/authors";
import {getMaterials} from "@/api/materials";
import {getTechniques} from "@/api/techniques";
import {getCategories} from "@/api/categories";
import {getCuts} from "@/api/cuts";
import {searchItems} from "@/lib/algolia";
import Search from "@/components/search";
import {UniqueIdentifier} from "@dnd-kit/core";

// Algolia's ceiling for a single request. The hits are only ids, and they have
// to be sorted into the manual order before the page can be sliced, so they all
// have to come back at once.
const MAX_HITS = 1000;

function parsePage(value?: string) {
    const page = Number(value);
    return Number.isFinite(page) && page > 1 ? Math.floor(page) - 1 : 0;
}

function parsePageSize(value?: string) {
    const size = Number(value);
    return PAGE_SIZES.includes(size) ? size : DEFAULT_PAGE_SIZE;
}

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: Promise<{
        q?: string;
        page?: string;
        size?: string;
    }>
}) {
    const {q, page, size} = await searchParams;

    let ids: UniqueIdentifier[] | undefined;

    if (q) {
        // No `published` filter here: unpublished items are indexed too, and the
        // admin list is exactly where they need to be findable.
        const response = await searchItems(q, undefined, 0, MAX_HITS);
        const result = response.results[0];

        ids = 'hits' in result ? result.hits.map((hit) => hit.objectID) : [];
    }

    const [items, authors, regions, materials, techniques, categories, cuts] = await Promise.all([
        getItemsPage({page: parsePage(page), pageSize: parsePageSize(size), ids}),
        getAuthors(), getRegions(), getMaterials(), getTechniques(), getCategories(), getCuts(),
    ]);

    return (
        <>
            <Card.Header>
                <VStack align="stretch" gap={4}>
                    <Heading>Предмети</Heading>
                    <Create authors={authors} regions={regions} materials={materials} techniques={techniques} categories={categories} cuts={cuts} />
                    <Search query={q} />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Items {...items} query={q} />
            </Card.Body>
        </>
    )
}
