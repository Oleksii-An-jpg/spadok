'use client';

import {FC, useCallback, useMemo, useState} from "react";
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
import {BiFirstPage, BiHide, BiLastPage, BiLeftArrowAlt, BiRightArrowAlt, BiShow, BiTrash} from "react-icons/bi";
import Link from "next/link";
import Row from "./row";
import {
    DndContext, closestCenter, type DragEndEvent,
    type UniqueIdentifier, useSensor, PointerSensor
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import {
    ColumnDef,
    PaginationState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import Filter from "@/components/filter";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";

type ItemsProps = {
    items: Item[]
    order: UniqueIdentifier[]
}

const Items: FC<ItemsProps> = ({ items, order }) => {
    const router = useRouter();
    const sensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
    });
    const { handleSubmit, formState: { isSubmitting } } = useForm();
    const handleDelete = useCallback(async (item: Item) => {
        await fetch(`/api/items`, {
            method: 'DELETE',
            body: JSON.stringify(item),
        });

        router.refresh();
    }, []);
    const toggleVisible = useCallback(async (item: Item) => {
        const { published } = item;
        await fetch(`/api/items`, {
            method: 'PATCH',
            body: JSON.stringify({
                published: !published,
                id: item.id,
            }),
        });

        router.refresh();
    }, []);
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            const oldIndex = order.indexOf(active.id)
            const newIndex = order.indexOf(over.id)
            const update = arrayMove(items, oldIndex, newIndex) //this is just a splice util
            console.log(update)
        }
    }

    const columns = useMemo<ColumnDef<Item>[]>(
        () => [
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
                header: 'Ідентифікатор',
                accessorKey: 'id',
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                header: 'Регіони',
                accessorFn: item => item.regions.map(region => region.name).join(', '),
                cell: info => {
                    return info.getValue()
                },
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
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                id: 'actions',
                header: 'Дії',
                enableSorting: false,
                enableColumnFilter: false,
                cell: info => {
                    const item = info.row.original;
                    return <Group>
                        <IconButton disabled={isSubmitting} size="sm" variant="outline" onClick={handleSubmit(() => {
                            return toggleVisible(info.row.original);
                        })}>
                            {item.published ? <BiHide /> : <BiShow />}
                        </IconButton>
                        <Dialog.Root role="alertdialog">
                            <Dialog.Trigger asChild>
                                <IconButton size="sm" colorPalette="red" variant="outline">
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
                                            <Button onClick={handleSubmit(() => {
                                                return handleDelete(info.row.original);
                                            })} disabled={isSubmitting} colorPalette="red">Видалити</Button>
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
            },
        ],
        [isSubmitting]
    )

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        columns,
        data: items,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        state: {
            pagination,
        },
        // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
    })

    return <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={[sensor]}
    >
        <Table.Root size="sm">
            <Table.Header>
                {table.getHeaderGroups().map(headerGroup => (
                    <Table.Row key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            return (
                                <Table.ColumnHeader verticalAlign="top" key={header.id} colSpan={header.colSpan}>
                                    <VStack align="stretch">
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                        {header.column.getCanFilter() ? (
                                            <Filter column={header.column} />
                                        ) : null}
                                    </VStack>
                                </Table.ColumnHeader>
                            )
                        })}
                    </Table.Row>
                ))}
            </Table.Header>
            <Table.Body>
                <SortableContext
                    items={order}
                    strategy={verticalListSortingStrategy}
                >
                    {table.getRowModel().rows.map(row => {
                        return (
                            <Row row={row.id} key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <Table.Cell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Table.Cell>
                                    )
                                })}
                            </Row>
                        )
                    })}
                </SortableContext>
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.Cell colSpan={table.getAllFlatColumns().length}>
                        <VStack align="stretch">
                            <HStack justify="space-between">
                                <Group>
                                    <IconButton
                                        size="xs"
                                        onClick={() => table.firstPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <BiFirstPage />
                                    </IconButton>
                                    <IconButton
                                        size="xs"
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                    >
                                        <BiLeftArrowAlt />
                                    </IconButton>
                                    <IconButton
                                        size="xs"
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <BiRightArrowAlt />
                                    </IconButton>
                                    <IconButton
                                        size="xs"
                                        onClick={() => table.lastPage()}
                                        disabled={!table.getCanNextPage()}
                                    >
                                        <BiLastPage />
                                    </IconButton>
                                    <HStack className="whitespace-nowrap">
                                        <Text>Сторінка</Text>
                                        <Text as="b">
                                            {table.getState().pagination.pageIndex + 1} із{' '}
                                            {table.getPageCount().toLocaleString()}
                                        </Text>
                                    </HStack>
                                </Group>
                                <Box>
                                    <NativeSelect.Root size="sm">
                                        <NativeSelect.Field value={table.getState().pagination.pageSize}
                                                            onChange={e => {
                                                                table.setPageSize(Number(e.target.value))
                                                            }}>
                                            {[10, 20, 30, 40, 50].map(pageSize => (
                                                <option key={pageSize} value={pageSize}>
                                                    Показати {pageSize}
                                                </option>
                                            ))}
                                        </NativeSelect.Field>
                                        <NativeSelect.Indicator />
                                    </NativeSelect.Root>
                                </Box>
                            </HStack>
                            <Text>
                                Показано {table.getRowModel().rows.length.toLocaleString()} із{' '}
                                {table.getRowCount().toLocaleString()} записів
                            </Text>
                        </VStack>
                    </Table.Cell>
                </Table.Row>
            </Table.Footer>
        </Table.Root>
    </DndContext>
}

export default Items;