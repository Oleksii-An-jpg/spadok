'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getMaterials} from "@/api/materials";
import Create from "@/components/material/create";

export default async function Page() {
    const materials = await getMaterials();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Матеріали</Heading>
                    <Create />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={materials} />
            </Card.Body>
        </>
    )
}