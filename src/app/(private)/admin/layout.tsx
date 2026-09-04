'use server'

import {ReactNode} from "react";
import {Alert, Card, Grid, GridItem, HStack} from "@chakra-ui/react";
import {requireRole} from "@/lib/session";
import Sidebar from "@/components/sidebar";
import Account from "@/components/account";
import {RoleProvider} from "@/components/role";
import {canEdit} from "@/lib/roles";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await requireRole('viewer');

    return <RoleProvider role={session.role}>
        <Grid gridTemplateColumns="200px 1fr" p={4} gap={4}>
            <GridItem>
                <Sidebar />
            </GridItem>
            <GridItem>
                <HStack justify="space-between" align="start" mb={4}>
                    {!canEdit(session.role) ? <Alert.Root status="info" size="sm">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Режим перегляду</Alert.Title>
                            <Alert.Description>
                                Ваша роль дозволяє лише переглядати дані.
                            </Alert.Description>
                        </Alert.Content>
                    </Alert.Root> : <span />}
                    <Account
                        name={session.name ?? session.email ?? session.uid}
                        photoURL={session.picture}
                        role={session.role}
                    />
                </HStack>
                <Card.Root>
                    {children}
                </Card.Root>
            </GridItem>
        </Grid>
    </RoleProvider>
}
