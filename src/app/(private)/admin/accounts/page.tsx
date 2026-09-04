'use server';

import {Card, Heading, Text, VStack} from "@chakra-ui/react";
import {getAccounts} from "@/api/accounts";
import {requireRole} from "@/lib/session";
import Accounts from "@/components/accounts";

export default async function Page() {
    const session = await requireRole('admin');
    const accounts = await getAccounts();

    return (
        <>
            <Card.Header>
                <VStack align="start" gap={1}>
                    <Heading>Права</Heading>
                    <Text fontSize="sm" color="gray.500">
                        Користувачі адмінки та їхні права. Зміна ролі завершує активні сесії користувача.
                    </Text>
                </VStack>
            </Card.Header>
            <Card.Body>
                <Accounts accounts={accounts} currentUid={session.uid} />
            </Card.Body>
        </>
    )
}
