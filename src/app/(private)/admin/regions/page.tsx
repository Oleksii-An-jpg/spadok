'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import {getRegions} from "@/api/regions";
import Entities from "@/components/entities";
import Create from "@/components/region/create";
import {getItems} from "@/api/items";

export default async function Page() {
    const [regions, {items}] = await Promise.all([getRegions(), getItems()]);

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Регіони</Heading>
                    <Create />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={regions.map(region => ({
                    ...region,
                    count: items.filter(item => item.region?.includes(region.id)).length
                }))} />
            </Card.Body>
        </>
    )
}