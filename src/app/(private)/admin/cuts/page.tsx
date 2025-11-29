'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getCuts} from "@/api/cuts";
import Create from "@/components/cut/create";
import {getItems} from "@/api/items";

export default async function Page() {
    const [cuts, {items}] = await Promise.all([getCuts(), getItems()]);

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Крої</Heading>
                    <Create />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={cuts.map(cut => ({
                    ...cut,
                    count: items.filter(item => item.cuts?.includes(cut.id)).length
                }))} />
            </Card.Body>
        </>
    )
}