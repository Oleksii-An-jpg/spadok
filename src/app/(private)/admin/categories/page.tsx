'use server';

import {Button, Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getCategories} from "@/api/categories";

export default async function Page() {
    const categories = await getCategories();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Категорії</Heading>
                    <Button>Додати категорію</Button>
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={categories} />
            </Card.Body>
        </>
    )
}