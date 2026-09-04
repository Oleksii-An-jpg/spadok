'use client';
import {FC, useCallback, useMemo, useState} from "react";
import {
    Avatar,
    Badge,
    Portal,
    Select,
    Table,
    Text,
    VStack,
    createListCollection,
} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {Account} from "@/models/account";
import {ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES, Role} from "@/lib/roles";
import {toaster} from "@/components/ui/toaster";

type AccountsProps = {
    accounts: Account[];
    /** The signed-in admin, who may not change their own role. */
    currentUid: string;
}

const EditRole: FC<{ account: Account }> = ({ account }) => {
    const router = useRouter();
    const [role, setRole] = useState<Role>(account.role);
    const [pending, setPending] = useState(false);

    const roles = useMemo(() => createListCollection({
        items: ROLES.map((value) => ({ value, label: ROLE_LABELS[value] })),
    }), []);

    const handleChange = useCallback(async (next: Role) => {
        const previous = role;
        setRole(next);
        setPending(true);

        const response = await fetch('/api/accounts', {
            method: 'PATCH',
            body: JSON.stringify({ uid: account.uid, role: next }),
        });

        setPending(false);

        if (!response.ok) {
            const { message } = await response.json().catch(() => ({ message: null }));
            setRole(previous);
            toaster.error({
                title: "Не вдалося змінити роль",
                description: message ?? "Спробуйте ще раз.",
                duration: 5000,
            });
            return;
        }

        toaster.success({
            title: "Роль змінено",
            description: `${account.displayName ?? account.email ?? account.uid} — ${ROLE_LABELS[next]}`,
            duration: 3000,
        });

        router.refresh();
    }, [account, role, router]);

    return <Select.Root
        size="xs"
        width="180px"
        disabled={pending}
        value={[role]}
        onValueChange={({ value }) => {
            const [next] = value;
            if (next && next !== role) handleChange(next as Role);
        }}
        collection={roles}
    >
        <Select.HiddenSelect />
        <Select.Control>
            <Select.Trigger>
                <Select.ValueText placeholder="Оберіть роль" />
            </Select.Trigger>
            <Select.IndicatorGroup>
                <Select.Indicator />
            </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
            <Select.Positioner>
                <Select.Content>
                    {roles.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                            <VStack align="start" gap={0}>
                                <Text>{item.label}</Text>
                                <Text fontSize="xs" color="gray.500">{ROLE_DESCRIPTIONS[item.value]}</Text>
                            </VStack>
                            <Select.ItemIndicator />
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Positioner>
        </Portal>
    </Select.Root>
}

const Accounts: FC<AccountsProps> = ({ accounts, currentUid }) => {
    return <Table.Root size="sm" variant="outline">
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeader w="1"></Table.ColumnHeader>
                <Table.ColumnHeader>Контакти</Table.ColumnHeader>
                <Table.ColumnHeader>Останній вхід</Table.ColumnHeader>
                <Table.ColumnHeader w="1">Роль</Table.ColumnHeader>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {accounts.map((account) => {
                const name = account.displayName ?? account.email ?? account.phoneNumber ?? account.uid;
                const contacts = [account.displayName, account.email, account.phoneNumber].filter(Boolean).join(', ');

                return (
                    <Table.Row key={account.uid}>
                        <Table.Cell>
                            <Avatar.Root size="sm" colorPalette="blue">
                                <Avatar.Fallback name={name} />
                                <Avatar.Image src={account.photoURL ?? undefined} />
                            </Avatar.Root>
                        </Table.Cell>
                        <Table.Cell>
                            <VStack align="start" gap={1}>
                                <Text>{contacts || account.uid}</Text>
                                {account.uid === currentUid && <Badge size="xs" colorPalette="blue">Це ви</Badge>}
                                {account.disabled && <Badge size="xs" colorPalette="red">Вимкнено</Badge>}
                            </VStack>
                        </Table.Cell>
                        <Table.Cell>
                            <Text fontSize="xs" color="gray.500">
                                {account.lastSignInTime
                                    ? new Date(account.lastSignInTime).toLocaleString('uk-UA')
                                    : '—'}
                            </Text>
                        </Table.Cell>
                        <Table.Cell>
                            {account.uid === currentUid
                                ? <Badge colorPalette="green">{ROLE_LABELS[account.role]}</Badge>
                                : <EditRole account={account} />}
                        </Table.Cell>
                    </Table.Row>
                );
            })}
        </Table.Body>
    </Table.Root>
}

export default Accounts;
