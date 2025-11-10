'use server';

import {Button, Card, Heading, VStack} from "@chakra-ui/react";
import {getRegions} from "@/api/regions";
import Entities from "@/components/entities";

export default async function Page() {
    const regions = await getRegions();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Регіони</Heading>
                    <Button>Додати регіон</Button>
                </VStack>
            </Card.Header>
            <Card.Body>
                <Entities items={regions} />
            </Card.Body>
        </>
    )
}