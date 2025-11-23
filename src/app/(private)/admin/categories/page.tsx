'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getCategories} from "@/api/categories";
import Create from "@/components/category/create";

export default async function Page() {
    const categories = await getCategories();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Каталог</Heading>
                    <Create />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={categories} />
            </Card.Body>
        </>
    )
}