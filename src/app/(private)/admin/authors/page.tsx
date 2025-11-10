'use server';

import {Button, Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getAuthors} from "@/api/authors";

export default async function Page() {
    const authors = await getAuthors();

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
                }))} />
            </Card.Body>
        </>
    )
}