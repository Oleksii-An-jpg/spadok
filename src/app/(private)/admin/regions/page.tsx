'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import {getRegions} from "@/api/regions";
import Entities from "@/components/entities";
import Create from "@/components/region/create";

export default async function Page() {
    const regions = await getRegions();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Регіони</Heading>
                    <Create />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={regions} />
            </Card.Body>
        </>
    )
}