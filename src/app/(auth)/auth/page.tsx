'use client';

import {
    Alert,
    Badge,
    Button,
    Card,
    Center,
    Group,
    HStack,
    Heading,
    Link as ChakraLink,
    Spinner,
    Tabs,
    Text,
    VStack,
} from '@chakra-ui/react';
import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import Link from "next/link";
import {BiLogoGoogle} from "react-icons/bi";
import {useBoolean} from "usehooks-ts";
import {auth} from "@/lib/client";
import {endSession} from "@/lib/auth-client";
import {hasAtLeast, ROLE_LABELS} from "@/lib/roles";
import EmailAuth from "./_ui/email";
import PhoneAuth from "./_ui/phone";
import {useAuthState} from "./_ui/use-auth-state";

export default function Auth() {
    const { value: isSignUp, toggle } = useBoolean(false);
    const { checked, user, role } = useAuthState();

    async function handleGoogleLogin() {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (err) {
            console.error("Google login error:", err);
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
                <Heading>{user.displayName ?? user.email ?? user.phoneNumber}</Heading>
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
            <Tabs.Root defaultValue="email" fitted>
                <Tabs.List>
                    <Tabs.Trigger value="email">Пошта</Tabs.Trigger>
                    <Tabs.Trigger value="phone">Телефон</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="email" pt={4}>
                    <EmailAuth isSignUp={isSignUp} />
                </Tabs.Content>

                <Tabs.Content value="phone" pt={4}>
                    <PhoneAuth />
                </Tabs.Content>
            </Tabs.Root>
        </Card.Body>

        <Card.Footer>
            <HStack w="full" wrap="wrap" justify="space-between">
                <Button variant="outline" onClick={handleGoogleLogin}>
                    <BiLogoGoogle />
                    Зайти через Ґуґл
                </Button>
                <HStack>
                    <Text fontSize="sm">
                        {isSignUp ? 'Вже маєте обліковий запис?' : 'Немає облікового запису?'}
                    </Text>
                    <Button size="xs" variant="outline" onClick={toggle}>
                        {isSignUp ? 'Увійти' : 'Зареєструватися'}
                    </Button>
                </HStack>
            </HStack>
        </Card.Footer>
    </Card.Root>
}
