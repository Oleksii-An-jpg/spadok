'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import {getRegions} from "@/api/regions";
import Create from "@/components/region/create";
import {getItems} from "@/api/items";
import Regions from "@/components/regions";

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
                <Regions regions={regions} items={items} />
            </Card.Body>
        </>
    )
}