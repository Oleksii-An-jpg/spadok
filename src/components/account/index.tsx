'use client';
import {FC} from "react";
import {Avatar, Badge, Menu, Portal, Text, VStack} from "@chakra-ui/react";
import {useRouter} from "next/navigation";
import {endSession} from "@/lib/auth-client";
import {ROLE_LABELS, Role} from "@/lib/roles";

type AccountProps = {
    name: string;
    photoURL: string | null;
    role: Role;
}

const Account: FC<AccountProps> = ({ name, photoURL, role }) => {
    const router = useRouter();

    return <Menu.Root positioning={{ placement: "bottom-end" }}>
        <Menu.Trigger rounded="full" focusRing="outside">
            <Avatar.Root size="sm" colorPalette="blue">
                <Avatar.Fallback name={name} />
                <Avatar.Image src={photoURL ?? undefined} />
            </Avatar.Root>
        </Menu.Trigger>
        <Portal>
            <Menu.Positioner>
                <Menu.Content>
                    <Menu.ItemGroup>
                        <VStack align="start" gap={1} px={2} py={1}>
                            <Text fontSize="sm">{name}</Text>
                            <Badge size="xs" colorPalette="blue">{ROLE_LABELS[role]}</Badge>
                        </VStack>
                    </Menu.ItemGroup>
                    <Menu.Separator />
                    <Menu.Item
                        value="logout"
                        onClick={async () => {
                            await endSession();
                            router.replace('/auth');
                        }}
                    >
                        Вийти
                    </Menu.Item>
                </Menu.Content>
            </Menu.Positioner>
        </Portal>
    </Menu.Root>
}

export default Account;
