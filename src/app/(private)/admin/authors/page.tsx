'use server';

import {Button, Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getAuthors} from "@/api/authors";
import {getItems} from "@/api/items";

export default async function Page() {
    const [authors, {items}] = await Promise.all([getAuthors(), getItems()]);

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Автори</Heading>
                    <Button>Додати автора</Button>
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={authors.map(author => ({
                    id: author.id,
                    name: `${author.firstName} ${author.lastName}`,
                    count: items.filter(item => item.author === author.id).length
                }))} />
            </Card.Body>
        </>
    )
}