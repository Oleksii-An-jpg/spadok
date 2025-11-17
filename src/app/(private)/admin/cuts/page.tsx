'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getCuts} from "@/api/cuts";
import Create from "@/components/cut/create";

export default async function Page() {
    const cuts = await getCuts();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Крої</Heading>
                    <Create />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={cuts} />
            </Card.Body>
        </>
    )
}