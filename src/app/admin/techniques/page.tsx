'use server';

import {Button, Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getTechniques} from "@/api/techniques";

export default async function Page() {
    const techniques = await getTechniques();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Техніки</Heading>
                    <Button>Додати техніку</Button>
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={techniques} />
            </Card.Body>
        </>
    )
}