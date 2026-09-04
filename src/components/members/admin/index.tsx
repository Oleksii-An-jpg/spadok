'use client';
import {FC, useCallback, useState} from "react";
import {
    Box,
    Button,
    ButtonGroup,
    CloseButton,
    Dialog,
    Group,
    IconButton,
    Link as ChakraLink,
    Portal,
    Table,
    Text,
} from "@chakra-ui/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {BiCaretDown, BiCaretUp, BiTrash} from "react-icons/bi";
import {arrayMove} from "@dnd-kit/sortable";
import {Member} from "@/models/member";
import {getImageUrl} from "@/lib/images";
import {toaster} from "@/components/ui/toaster";
import {useCanEdit} from "@/components/role";

type MembersProps = {
    members: Member[]
}

const Members: FC<MembersProps> = ({ members }) => {
    const router = useRouter();
    const canEdit = useCanEdit();
    const [pending, setPending] = useState(false);

    const handleDelete = useCallback(async (member: Member) => {
        setPending(true);
        await fetch('/api/members', {
            method: 'DELETE',
            body: JSON.stringify(member),
        });
        setPending(false);

        router.refresh();
    }, [router]);

    const handleMove = useCallback(async (id: string, direction: 'up' | 'down') => {
        const currentIndex = members.findIndex(member => member.id === id);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (currentIndex === -1 || targetIndex < 0 || targetIndex >= members.length) return;

        const toasterID = "reordering";
        if (!toaster.isVisible(toasterID)) {
            toaster.loading({
                id: toasterID,
                title: "Працюємо...",
                description: "Дочекайтесь завершення операції.",
            })
        }

        setPending(true);
        await fetch('/api/members/reorder', {
            method: 'PATCH',
            body: JSON.stringify({
                ids: arrayMove(members, currentIndex, targetIndex).map(member => member.id),
            }),
        });
        setPending(false);

        toaster.update(toasterID, {
            title: "Мой як файно 🥳🥳🥳!!!",
            description: "Операцію завершено.",
            type: "success",
            duration: 3000,
        })

        router.refresh();
    }, [members, router]);

    return <Table.Root size="sm" variant="outline">
        <Table.Header>
            <Table.Row>
                {canEdit && <Table.ColumnHeader w="1">Порядок</Table.ColumnHeader>}
                <Table.ColumnHeader w="1">Світлина</Table.ColumnHeader>
                <Table.ColumnHeader>Ім’я</Table.ColumnHeader>
                <Table.ColumnHeader>Роль</Table.ColumnHeader>
                <Table.ColumnHeader>Instagram</Table.ColumnHeader>
                {canEdit && <Table.ColumnHeader w="1">Дії</Table.ColumnHeader>}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {members.map((member, index) => (
                <Table.Row key={member.id}>
                    {canEdit && <Table.Cell>
                        <ButtonGroup orientation="vertical" size="2xs" variant="ghost">
                            <IconButton aria-label="Вище" disabled={pending || index === 0} onClick={() => handleMove(member.id, 'up')}>
                                <BiCaretUp />
                            </IconButton>
                            <IconButton aria-label="Нижче" disabled={pending || index === members.length - 1} onClick={() => handleMove(member.id, 'down')}>
                                <BiCaretDown />
                            </IconButton>
                        </ButtonGroup>
                    </Table.Cell>}
                    <Table.Cell>
                        {member.photo ? <Box overflow="hidden" w="12" h="12" display="flex" alignItems="center" justifyContent="center">
                            <img src={getImageUrl(member.photo)} alt={member.name} />
                        </Box> : null}
                    </Table.Cell>
                    <Table.Cell>
                        <ChakraLink asChild variant="underline">
                            <Link prefetch={false} href={`/admin/members/${member.id}`}>
                                {member.name}
                            </Link>
                        </ChakraLink>
                    </Table.Cell>
                    <Table.Cell>{member.role}</Table.Cell>
                    <Table.Cell>
                        {member.instagram ? <ChakraLink variant="underline" href={member.instagram} target="_blank">
                            {member.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, '')}
                        </ChakraLink> : null}
                    </Table.Cell>
                    {canEdit && <Table.Cell>
                        <Group>
                            <Dialog.Root role="alertdialog">
                                <Dialog.Trigger asChild>
                                    <IconButton aria-label="Видалити" size="sm" colorPalette="red" variant="outline">
                                        <BiTrash />
                                    </IconButton>
                                </Dialog.Trigger>
                                <Portal>
                                    <Dialog.Backdrop />
                                    <Dialog.Positioner>
                                        <Dialog.Content>
                                            <Dialog.Header>
                                                <Dialog.Title>Ви впевнені?</Dialog.Title>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                                Видалення цього елемента є незворотнім. Ви дійсно хочете видалити <Text as="b">«{member.name}»</Text>?
                                            </Dialog.Body>
                                            <Dialog.Footer>
                                                <Dialog.ActionTrigger asChild>
                                                    <Button variant="outline">Скасувати</Button>
                                                </Dialog.ActionTrigger>
                                                <Button onClick={() => handleDelete(member)} loading={pending} colorPalette="red">Видалити</Button>
                                            </Dialog.Footer>
                                            <Dialog.CloseTrigger asChild>
                                                <CloseButton size="sm" />
                                            </Dialog.CloseTrigger>
                                        </Dialog.Content>
                                    </Dialog.Positioner>
                                </Portal>
                            </Dialog.Root>
                        </Group>
                    </Table.Cell>}
                </Table.Row>
            ))}
        </Table.Body>
    </Table.Root>
}

export default Members;
