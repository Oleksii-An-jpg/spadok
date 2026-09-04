'use client';
import {FC, useCallback, useEffect, useMemo, useState} from "react";
import {
    Box,
    Button,
    ButtonGroup,
    CloseButton,
    Dialog,
    Group,
    HStack,
    IconButton,
    Link as ChakraLink,
    Portal,
    Table,
    Text,
} from "@chakra-ui/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {BiCaretDown, BiCaretUp, BiTrash} from "react-icons/bi";
import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {restrictToVerticalAxis} from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {Member} from "@/models/member";
import {getImageUrl} from "@/lib/images";
import {toaster} from "@/components/ui/toaster";
import {useCanEdit} from "@/components/role";
import {DragHandle, SortableRow} from "@/components/sortable";

type MembersProps = {
    members: Member[]
}

const REORDER_TOAST = "reordering";

const Members: FC<MembersProps> = ({ members }) => {
    const router = useRouter();
    const canEdit = useCanEdit();
    const [pending, setPending] = useState(false);

    // Mirrors the server list so a drag can land immediately; the next render
    // from the server takes over again.
    const [rows, setRows] = useState(members);

    useEffect(() => setRows(members), [members]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDelete = useCallback(async (member: Member) => {
        setPending(true);
        await fetch('/api/members', {
            method: 'DELETE',
            body: JSON.stringify(member),
        });
        setPending(false);

        router.refresh();
    }, [router]);

    const reorder = useCallback(async (next: Member[]) => {
        // Optimistic: the row stays where it was dropped while the write runs.
        setRows(next);

        if (!toaster.isVisible(REORDER_TOAST)) {
            toaster.loading({
                id: REORDER_TOAST,
                title: "Працюємо...",
                description: "Дочекайтесь завершення операції.",
            })
        }

        setPending(true);

        try {
            const response = await fetch('/api/members/reorder', {
                method: 'PATCH',
                body: JSON.stringify({ ids: next.map(member => member.id) }),
            });

            if (!response.ok) throw new Error(await response.text());

            toaster.update(REORDER_TOAST, {
                title: "Мой як файно 🥳🥳🥳!!!",
                description: "Операцію завершено.",
                type: "success",
                duration: 3000,
            })

            router.refresh();
        } catch (error) {
            console.error(error);

            setRows(members);

            toaster.update(REORDER_TOAST, {
                title: "Не вдалося змінити порядок",
                description: "Спробуйте ще раз.",
                type: "error",
                duration: 5000,
            })
        } finally {
            setPending(false);
        }
    }, [members, router]);

    const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;

        const from = rows.findIndex(member => member.id === active.id);
        const to = rows.findIndex(member => member.id === over.id);

        if (from === -1 || to === -1) return;

        void reorder(arrayMove(rows, from, to));
    }, [rows, reorder]);

    const handleMove = useCallback((id: string, delta: number) => {
        const from = rows.findIndex(member => member.id === id);
        const to = from + delta;

        if (from === -1 || to < 0 || to >= rows.length) return;

        void reorder(arrayMove(rows, from, to));
    }, [rows, reorder]);

    const ids = useMemo(() => rows.map(member => member.id), [rows]);

    return <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
    >
        <Table.Root size="sm" variant="outline">
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
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    {rows.map((member, index) => (
                        <SortableRow id={member.id} disabled={!canEdit || pending} key={member.id}>
                            {canEdit && <Table.Cell>
                                <HStack gap="0">
                                    <DragHandle disabled={pending} />
                                    <ButtonGroup orientation="vertical" size="2xs" variant="ghost">
                                        <IconButton aria-label="Вище" disabled={pending || index === 0} onClick={() => handleMove(member.id, -1)}>
                                            <BiCaretUp />
                                        </IconButton>
                                        <IconButton aria-label="Нижче" disabled={pending || index === rows.length - 1} onClick={() => handleMove(member.id, 1)}>
                                            <BiCaretDown />
                                        </IconButton>
                                    </ButtonGroup>
                                </HStack>
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
                        </SortableRow>
                    ))}
                </SortableContext>
            </Table.Body>
        </Table.Root>
    </DndContext>
}

export default Members;
