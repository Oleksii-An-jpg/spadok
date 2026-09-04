'use server';

import {Card, Heading, VStack} from "@chakra-ui/react";
import {getMembers} from "@/api/members";
import Members from "@/components/members/admin";
import Create from "@/components/member/create";

export default async function Page() {
    const members = await getMembers();

    return (
        <>
            <Card.Header>
                <VStack align="start">
                    <Heading>Команда</Heading>
                    <Create />
                </VStack>
            </Card.Header>
            <Card.Body>
                <Members members={members} />
            </Card.Body>
        </>
    )
}
