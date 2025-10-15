'use server';

import {getItems} from "@/api/items";
import Items from "@/components/items";
import {Button, Card, Heading, VStack} from "@chakra-ui/react";

export default async function Page() {
    const {items, order} = await getItems();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Предмети</Heading>
                    <Button>Додати предмет</Button>
                </VStack>
            </Card.Header>
            <Card.Body>
                <Items items={items} order={order} />
            </Card.Body>
        </>
    )
}