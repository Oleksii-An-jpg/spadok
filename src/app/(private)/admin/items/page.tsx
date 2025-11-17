'use server';

import {getItems} from "@/api/items";
import Items from "@/components/items";
import {Card, Heading, VStack} from "@chakra-ui/react";
import Create from "@/components/exhibition/create";
import {getRegions} from "@/api/regions";
import {getAuthors} from "@/api/authors";
import {getMaterials} from "@/api/materials";
import {getTechniques} from "@/api/techniques";
import {getCategories} from "@/api/categories";
import {getCuts} from "@/api/cuts";
import {searchItems} from "@/lib/algolia";
import {UniqueIdentifier} from "@dnd-kit/core";

export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: Promise<{
        q?: string;
    }>
}) {
    const q = (await searchParams).q;
    const {items: all, order} = await getItems();

    let items = all;

    if (q) {
        const filters: string[] = ['published:true'];
        const response = await searchItems(
            q,
            filters.join(' AND '),
        );

        const result = response.results[0];

        if ('hits' in result) {
            const ids: UniqueIdentifier[] = result.hits.map((hit) => hit.objectID);
            items = all.filter((item) => ids.includes(item.id))
        }
    }

    const [authors, regions, materials, techniques, categories, cuts] = await Promise.all([getAuthors(), getRegions(), getMaterials(), getTechniques(), getCategories(), getCuts()]);

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Предмети</Heading>
                    <Create authors={authors} regions={regions} materials={materials} techniques={techniques} categories={categories} cuts={cuts} />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Items items={items} order={order} />
            </Card.Body>
        </>
    )
}