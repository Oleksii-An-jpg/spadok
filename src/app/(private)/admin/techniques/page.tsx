'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getTechniques} from "@/api/techniques";
import Create from "@/components/technique/create";
import {getItems} from "@/api/items";

export default async function Page() {
    const [techniques, {items}] = await Promise.all([getTechniques(), getItems()]);

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Техніки</Heading>
                    <Create />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={techniques.map(technique => ({
                    ...technique,
                    count: items.filter(item => item.techniques?.includes(technique.id)).length
                }))} />
            </Card.Body>
        </>
    )
}