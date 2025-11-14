'use client';

import {FC, useMemo, useState, useEffect, InputHTMLAttributes} from "react";
import {Item} from "@/models/item";
import {Group, IconButton, Table, Link as ChakraLink, HStack, NativeSelect, Text, Box, VStack, Field, Input} from "@chakra-ui/react";
import {BiFirstPage, BiHide, BiLastPage, BiLeftArrowAlt, BiRightArrowAlt, BiTrash} from "react-icons/bi";
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
    Column,
    ColumnDef,
    PaginationState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

// A typical debounced input react component
function DebouncedInput({
                            value: initialValue,
                            onChange,
                            debounce = 500,
                            ...props
                        }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return <Field.Root>
        <Input placeholder="me@example.com" {...props} size="xs" value={value} onChange={e => setValue(e.target.value)} />
    </Field.Root>
}

function Filter({ column }: { column: Column<Item> }) {
    const columnFilterValue = column.getFilterValue()

    return <DebouncedInput
        onChange={value => column.setFilterValue(value)}
        placeholder={`Пошук...`}
        type="text"
        value={(columnFilterValue ?? '') as string}
    />
}

type ItemsProps = {
    items: Item[]
    order: UniqueIdentifier[]
}

const Items: FC<ItemsProps> = ({ items, order }) => {
    const sensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 10 },
    });
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
                header: 'Регіони',
                accessorFn: item => item.regions.map(region => region.name).join(', '),
                cell: info => {
                    return info.getValue()
                },
            },
            {
                accessorKey: 'id',
                header: 'Дії',
                enableSorting: false,
                enableColumnFilter: false,
                cell: info => {
                    const item = info.row.original;
                    return <Group>
                        <IconButton size="sm" variant="outline">
                            <BiHide />
                        </IconButton>
                        <IconButton size="sm" colorPalette="red" variant="outline">
                            <BiTrash />
                        </IconButton>
                    </Group>
                }
            },
        ],
        []
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
                <Table.Row>
                    {/*<Table.ColumnHeader>Ідентифікатор</Table.ColumnHeader>*/}
                    {/*<Table.ColumnHeader>Назва</Table.ColumnHeader>*/}
                    {/*<Table.ColumnHeader>Регіон</Table.ColumnHeader>*/}
                    {/*<Table.ColumnHeader>Дії</Table.ColumnHeader>*/}
                </Table.Row>
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
                    {/*{items.map(item => (*/}
                    {/*    <Row key={item.id} row={item.id}>*/}
                    {/*        <Table.Cell>*/}
                    {/*            <ChakraLink asChild variant="underline">*/}
                    {/*                <Link prefetch={false} href={`/admin/items/${item.id}`}>*/}
                    {/*                    {item.name}*/}
                    {/*                </Link>*/}
                    {/*            </ChakraLink>*/}
                    {/*        </Table.Cell>*/}
                    {/*        <Table.Cell>{item.regions.map(region => region.name).join(', ')}</Table.Cell>*/}
                    {/*        <Table.Cell>*/}
                    {/*            <Group>*/}
                    {/*                <IconButton size="sm" variant="outline">*/}
                    {/*                    <BiHide />*/}
                    {/*                </IconButton>*/}
                    {/*                <IconButton size="sm" colorPalette="red" variant="outline">*/}
                    {/*                    <BiTrash />*/}
                    {/*                </IconButton>*/}
                    {/*            </Group>*/}
                    {/*        </Table.Cell>*/}
                    {/*    </Row>*/}
                    {/*))}*/}
                </SortableContext>
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.Cell colSpan={columns.length}>
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