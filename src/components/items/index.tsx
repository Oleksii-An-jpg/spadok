'use client';

import {FC, useCallback, useEffect, useMemo, useState} from "react";
import {Item} from "@/models/item";
import {
    Group,
    IconButton,
    Table,
    Link as ChakraLink,
    HStack,
    NativeSelect,
    Text,
    Box,
    VStack,
    Dialog, Portal, Button, CloseButton
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster"
import {
    BiFirstPage,
    BiHide,
    BiLastPage,
    BiLeftArrowAlt,
    BiLinkExternal,
    BiRightArrowAlt,
    BiShow,
    BiTrash,
} from "react-icons/bi";
import Link from "next/link";
import {DragHandle, SortableRow} from "@/components/sortable";
import {
    DndContext, closestCenter, type DragEndEvent, type UniqueIdentifier,
    KeyboardSensor, PointerSensor, useSensor, useSensors
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import {
    ColumnDef,
    OnChangeFn,
    PaginationState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {usePathname, useRouter} from "next/navigation";
import {useCanEdit} from "@/components/role";
import {DEFAULT_PAGE_SIZE, PAGE_SIZES} from "@/lib/pagination";


type ItemsProps = {
    /** Only the current page — the rest of the list never reaches the browser. */
    items: Item[]
    /** Zero-based. */
    page: number
    pageSize: number
    total: number
    pageCount: number
    query?: string
}

/** Body of a PATCH to /api/items/reorder. */
type Move = {
    activeId: UniqueIdentifier
    overId: UniqueIdentifier
}

const REORDER_TOAST = "reordering";

const Items: FC<ItemsProps> = ({ items, page, pageSize, total, pageCount, query }) => {
    const router = useRouter();
    const pathname = usePathname();
    const canEdit = useCanEdit();

    // Positions are global, so reordering only makes sense while the full,
    // unfiltered list is on screen.
    const sortable = canEdit && !query;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    // Mirrors the server page so a drag can land immediately instead of waiting
    // for the round trip; the next render from the server takes over again.
    const [rows, setRows] = useState(items);
    const [pending, setPending] = useState(false);

    useEffect(() => setRows(items), [items]);

    const goTo = useCallback((next: { page?: number, pageSize?: number }) => {
        const index = next.page ?? page;
        const size = next.pageSize ?? pageSize;

        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (index > 0) params.set('page', String(index + 1));
        if (size !== DEFAULT_PAGE_SIZE) params.set('size', String(size));

        const search = params.toString();
        router.push(search ? `${pathname}?${search}` : pathname);
    }, [page, pageSize, query, pathname, router]);

    const reorder = useCallback(async (move: Move) => {
        if (!toaster.isVisible(REORDER_TOAST)) {
            toaster.loading({
                id: REORDER_TOAST,
                title: "Працюємо...",
                description: "Дочекайтесь завершення операції.",
            })
        }

        setPending(true);

        try {
            const response = await fetch(`/api/items/reorder`, {
                method: 'PATCH',
                body: JSON.stringify(move),
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

            // Put the optimistic move back where the server still has it.
            setRows(items);

            toaster.update(REORDER_TOAST, {
                title: "Не вдалося змінити порядок",
                description: "Спробуйте ще раз.",
                type: "error",
                duration: 5000,
            })
        } finally {
            setPending(false);
        }
    }, [items, router]);

    const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;

        const from = rows.findIndex(item => item.id === active.id);
        const to = rows.findIndex(item => item.id === over.id);

        if (from === -1 || to === -1) return;

        setRows(arrayMove(rows, from, to));

        void reorder({ activeId: active.id, overId: over.id });
    }, [rows, reorder]);

    const handleDelete = useCallback(async (item: Item) => {
        await fetch(`/api/items`, {
            method: 'DELETE',
            body: JSON.stringify(item),
        });

        router.refresh();
    }, [router]);

    const toggleVisible = useCallback(async (item: Item) => {
        await fetch(`/api/items`, {
            method: 'PATCH',
            body: JSON.stringify({
                published: !item.published,
                id: item.id,
            }),
        });

        router.refresh();
    }, [router]);

    const columns = useMemo<ColumnDef<Item>[]>(
        () => [
            ...(sortable ? [{
                id: 'order',
                header: 'Порядок',
                cell: () => <DragHandle disabled={pending} />,
            } satisfies ColumnDef<Item>] : []),
            {
                accessorKey: 'name',
                header: 'Назва',
                cell: info => {
                    const item = info.row.original;
                    return <ChakraLink asChild variant="underline">
                        <Link prefetch={false} href={`/admin/items/${item.id}`}>
                            {item.name}
                        </Link>
                    </ChakraLink>
                },
            },
            {
                header: 'Інвентарний номер',
                accessorKey: 'inventory',
            },
            {
                header: 'Регіони',
                accessorFn: item => item.regions.map(region => region.name).join(', '),
                cell: info => info.getValue(),
            },
            {
                accessorFn: item => item.images[0],
                header: 'Фото',
                cell: info => {
                    const image = info.getValue();
                    return image ? <Box overflow="hidden" w="12" h="12" display="flex" alignItems="center" justifyContent="center">
                        <img src={`https://storage.googleapis.com/spadok-images/${image}`} alt="Item image" />
                    </Box> : null;
                },
            },
            ...(canEdit ? [{
                id: 'actions',
                header: 'Дії',
                cell: info => {
                    const item = info.row.original;
                    return <Group>
                        <IconButton
                            aria-label="Відкрити на сайті"
                            title="Відкрити на сайті"
                            size="sm"
                            variant="outline"
                            asChild
                        >
                            <ChakraLink asChild variant="plain">
                                <Link href={`/items/${item.id}`} target="_blank" rel="noreferrer">
                                    <BiLinkExternal />
                                </Link>
                            </ChakraLink>
                        </IconButton>
                        <IconButton
                            aria-label={item.published ? 'Приховати' : 'Показати'}
                            size="sm"
                            variant="outline"
                            onClick={() => toggleVisible(item)}
                        >
                            {item.published ? <BiHide /> : <BiShow />}
                        </IconButton>
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
                                            Видалення цього елемента є незворотнім. Ви дійсно хочете видалити <Text as="b">«{item.name}»</Text>?
                                        </Dialog.Body>
                                        <Dialog.Footer>
                                            <Dialog.ActionTrigger asChild>
                                                <Button variant="outline">Скасувати</Button>
                                            </Dialog.ActionTrigger>
                                            <Button onClick={() => handleDelete(item)} colorPalette="red">Видалити</Button>
                                        </Dialog.Footer>
                                        <Dialog.CloseTrigger asChild>
                                            <CloseButton size="sm" />
                                        </Dialog.CloseTrigger>
                                    </Dialog.Content>
                                </Dialog.Positioner>
                            </Portal>
                        </Dialog.Root>
                    </Group>
                }
            } satisfies ColumnDef<Item>] : []),
        ],
        [sortable, canEdit, pending, handleDelete, toggleVisible]
    )

    const onPaginationChange: OnChangeFn<PaginationState> = useCallback(updater => {
        const current: PaginationState = { pageIndex: page, pageSize };
        const next = typeof updater === 'function' ? updater(current) : updater;

        goTo({
            // A different page size renumbers everything, so start over.
            page: next.pageSize === pageSize ? next.pageIndex : 0,
            pageSize: next.pageSize,
        });
    }, [page, pageSize, goTo]);

    const table = useReactTable({
        columns,
        data: rows,
        getCoreRowModel: getCoreRowModel(),
        // `data` is already the page the server sent, so page count comes from
        // the total row count rather than from the rows in hand.
        manualPagination: true,
        rowCount: total,
        onPaginationChange,
        state: {
            pagination: { pageIndex: page, pageSize },
        },
    })

    const ids = useMemo(() => rows.map(item => item.id), [rows]);

    return <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
    >
        {canEdit && query && <Text mb={2} color="fg.muted">
            Порядок предметів можна змінювати лише у повному списку — очистіть пошук.
        </Text>}
        <Table.Root size="sm">
            <Table.Header>
                {table.getHeaderGroups().map(headerGroup => (
                    <Table.Row key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <Table.ColumnHeader verticalAlign="top" key={header.id} colSpan={header.colSpan}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                ))}
            </Table.Header>
            <Table.Body>
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map(row => (
                        <SortableRow id={row.original.id} disabled={!sortable || pending} key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <Table.Cell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Table.Cell>
                            ))}
                        </SortableRow>
                    ))}
                    {!rows.length && <Table.Row>
                        <Table.Cell colSpan={table.getAllFlatColumns().length}>
                            <Text color="fg.muted">Нічого не знайдено.</Text>
                        </Table.Cell>
                    </Table.Row>}
                </SortableContext>
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.Cell colSpan={table.getAllFlatColumns().length}>
                        <VStack align="stretch">
                            <HStack justify="space-between">
                                <Group>
                                    <IconButton
                                        aria-label="Перша сторінка"
                                        size="xs"
                                        onClick={() => table.firstPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <BiFirstPage />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Попередня сторінка"
                                        size="xs"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <BiLeftArrowAlt />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Наступна сторінка"
                                        size="xs"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <BiRightArrowAlt />
                                    </IconButton>
                                    <IconButton
                                        aria-label="Остання сторінка"
                                        size="xs"
                                        onClick={() => table.lastPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <BiLastPage />
                                    </IconButton>
                                    <HStack className="whitespace-nowrap">
                                        <Text>Сторінка</Text>
                                        <Text as="b">
                                            {page + 1} із {pageCount.toLocaleString()}
                                        </Text>
                                    </HStack>
                                </Group>
                                <Box>
                                    <NativeSelect.Root size="sm">
                                        <NativeSelect.Field value={pageSize}
                                                            onChange={e => {
                                                                table.setPageSize(Number(e.target.value))
                                                            }}>
                                            {PAGE_SIZES.map(size => (
                                                <option key={size} value={size}>
                                                    Показати {size}
                                                </option>
                                            ))}
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </Box>
                            </HStack>
                            <Text>
                                Показано {rows.length.toLocaleString()} із{' '}
                                {total.toLocaleString()} записів
                            </Text>
                        </VStack>
                    </Table.Cell>
                </Table.Row>
            </Table.Footer>
        </Table.Root>
    </DndContext>
}

export default Items;
