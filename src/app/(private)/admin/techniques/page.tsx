'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getTechniques} from "@/api/techniques";
import Create from "@/components/technique/create";

export default async function Page() {
    const techniques = await getTechniques();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Техніки</Heading>
                    <Create />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={techniques} />
            </Card.Body>
        </>
    )
}