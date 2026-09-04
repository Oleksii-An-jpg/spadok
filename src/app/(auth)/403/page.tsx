'use client';

import {Alert, Button, Group, Link as ChakraLink, Text, VStack} from "@chakra-ui/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {endSession} from "@/lib/auth-client";

export default function Forbidden() {
    const router = useRouter();

    return <VStack gap={4} align="stretch">
        <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Content>
                <Alert.Title>Доступ заборонено</Alert.Title>
                <Alert.Description>
                    Ваш обліковий запис не має прав для доступу до адмінки. Щоб їх отримати, зв&#39;яжіться з{' '}
                    <ChakraLink variant="underline" asChild>
                        <Link href="mailto:voodoo.spr@gmail.com"><Text as="b">voodoo.spr@gmail.com</Text></Link>
                    </ChakraLink>
                </Alert.Description>
            </Alert.Content>
        </Alert.Root>

        <Group justifyContent="center">
            <Button asChild variant="outline">
                <ChakraLink asChild>
                    <Link href="/">На головну</Link>
                </ChakraLink>
            </Button>
            <Button
                onClick={async () => {
                    await endSession();
                    router.replace('/auth');
                }}
                colorPalette="orange"
                variant="subtle"
            >
                Вийти
            </Button>
        </Group>
    </VStack>
}
