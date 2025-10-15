'use server';

import {Button, Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getCuts} from "@/api/cuts";

export default async function Page() {
    const cuts = await getCuts();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Крої</Heading>
                    <Button>Додати крій</Button>
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={cuts} />
            </Card.Body>
        </>
    )
}