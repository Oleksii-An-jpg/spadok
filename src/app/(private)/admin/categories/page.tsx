'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getCategories} from "@/api/categories";
import Create from "@/components/category/create";
import {getItems} from "@/api/items";

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
                <Entities items={categories.map(category => ({
                    ...category,
                    count: items.filter(item => item.mainCategory === category.id || item.subCategories?.includes(category.id)).length
                }))} columns={[
                    {
                        accessorKey: 'isCollection',
                        header: 'Підбірка',
                        enableSorting: false,
                        enableColumnFilter: false,
                    }
                ]} />
            </Card.Body>
        </>
    )
}