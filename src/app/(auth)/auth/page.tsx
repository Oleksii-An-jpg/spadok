'use client';

import {
    Alert,
    Badge,
    Button,
    Card,
    Center,
    Group,
    Heading,
    Link as ChakraLink,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react';
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import Link from "next/link";
import {useState} from "react";
import {BiLogoGoogle} from "react-icons/bi";
import {auth} from "@/lib/client";
import {endSession} from "@/lib/auth-client";
import {hasAtLeast, ROLE_LABELS} from "@/lib/roles";
import {useAuthState} from "./_ui/use-auth-state";

export default function Auth() {
    const { checked, user, role } = useAuthState();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleGoogleLogin() {
        setPending(true);
        setError(null);

        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (e) {
            const code = (e as { code?: string }).code;

            // Closing the popup is a deliberate action, not something to report.
            if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
                setError((e as Error).message || 'Не вдалося увійти через Ґуґл');
            }
        } finally {
            setPending(false);
        }
    }

    if (!checked) {
        return <Center minH="50vh">
            <Spinner size="xl" colorPalette="blue" />
        </Center>
    }

    if (user) {
        const authorised = !!role && hasAtLeast(role, 'viewer');

        return <VStack gap={4} align="stretch">
            <VStack gap={1}>
                <Heading>{user.displayName ?? user.email}</Heading>
                {role && <Badge colorPalette={authorised ? 'green' : 'orange'}>{ROLE_LABELS[role]}</Badge>}
            </VStack>

            {!authorised && <Alert.Root status="warning">
                <Alert.Indicator />
                <Alert.Content>
                    <Alert.Title>Доступ заборонено</Alert.Title>
                    <Alert.Description>
                        Вам потрібні права для доступу до адмінки. Щоб їх отримати, зв&#39;яжіться з{' '}
                        <ChakraLink variant="underline" asChild>
                            <Link href="mailto:voodoo.spr@gmail.com"><Text as="b">voodoo.spr@gmail.com</Text></Link>
                        </ChakraLink>
                    </Alert.Description>
                </Alert.Content>
            </Alert.Root>}

            <Group justifyContent="center">
                {authorised && <Button asChild colorPalette="blue">
                    <ChakraLink asChild>
                        <Link href="/admin">До адмінки</Link>
                    </ChakraLink>
                </Button>}
                <Button onClick={() => endSession()} colorPalette="red" variant="outline">
                    Вийти
                </Button>
            </Group>
        </VStack>
    }

    return <Card.Root>
        <Card.Header>
            <Heading size="lg">Авторизація</Heading>
        </Card.Header>

        <Card.Body>
            <VStack gap={4} align="stretch">
                <Text fontSize="sm" color="gray.500">
                    Вхід до адмінки здійснюється через обліковий запис Ґуґл.
                </Text>

                {error && <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Description>{error}</Alert.Description>
                </Alert.Root>}

                <Button colorPalette="blue" width="full" loading={pending} onClick={handleGoogleLogin}>
                    <BiLogoGoogle />
                    Зайти через Ґуґл
                </Button>
            </VStack>
        </Card.Body>
    </Card.Root>
}
