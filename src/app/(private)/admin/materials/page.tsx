'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import Entities from "@/components/entities";
import {getMaterials} from "@/api/materials";
import Create from "@/components/material/create";
import {getItems} from "@/api/items";

export default async function Page() {
    const [materials, {items}] = await Promise.all([getMaterials(), getItems()]);

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Матеріали</Heading>
                    <Create />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={materials.map(material => ({
                    ...material,
                    count: items.filter(item => item.materials?.includes(material.id)).length
                }))} />
            </Card.Body>
        </>
    )
}