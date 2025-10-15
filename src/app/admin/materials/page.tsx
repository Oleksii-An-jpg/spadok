'use server';

import {Button, Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getMaterials} from "@/api/materials";

export default async function Page() {
    const materials = await getMaterials();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Матеріали</Heading>
                    <Button>Додати матеріал</Button>
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={materials} />
            </Card.Body>
        </>
    )
}