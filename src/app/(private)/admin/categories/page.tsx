'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import {getCategories} from "@/api/categories";
import Create from "@/components/category/create";
import {getItems} from "@/api/items";
import Categories from "@/components/categories";

export default async function Page() {
    const [categories, {items}] = await Promise.all([getCategories(), getItems()]);

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Категорії</Heading>
                    <Create />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Categories categories={categories} items={items} />
            </Card.Body>
        </>
    )
}