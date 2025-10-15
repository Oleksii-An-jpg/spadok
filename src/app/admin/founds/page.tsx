'use server';

import {getFounds} from "@/api/founds";
import {Box, Card, Heading} from "@chakra-ui/react";
import Founds from "@/components/founds";

export default async function Page() {
    const founds = await getFounds();

    return (
        <>
            <Card.Header>
                <Heading>Кошти</Heading>
            </Card.Header>
            <Card.Body>
                <Box maxW="md">
                    <Founds values={founds} />
                </Box>
            </Card.Body>
        </>
    )}