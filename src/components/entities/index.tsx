'use client';
import {
    Group,
    IconButton,
    Dialog,
    CloseButton,
    Button,
    Portal,
    Link as ChakraLink,
    Table,
    VStack, HStack, Text, Box, NativeSelect
} from "@chakra-ui/react";
import Link from "next/link";
import {BiFirstPage, BiLastPage, BiLeftArrowAlt, BiRightArrowAlt, BiTrash} from "react-icons/bi";
import {usePathname, useRouter} from "next/navigation";
import {useCallback, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {
    ColumnDef, flexRender,
    getCoreRowModel,
    getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    getFacetedUniqueValues,
    InitialTableState,
    useReactTable
} from "@tanstack/react-table";
import Filter from "@/components/filter";
import {useCanEdit} from "@/components/role";

type BaseItem = {
    id: string;
    name: string;
    count: number;
}

type EntitiesProps<T> = {
    items: T[];
    columns?: ColumnDef<T>[];
    initialState?: InitialTableState
}

function Entities<T extends BaseItem>({items, initialState, columns = []}: EntitiesProps<T>) {
    const pathname = usePathname();
    const router = useRouter();
    const canEdit = useCanEdit();
    const handleDelete = useCallback(async (item: T) => {
        await fetch(`/api/${pathname.replace('/admin', '')}`, {
            method: 'DELETE',
            body: JSON.stringify(item),
        });

        router.refresh();
    }, []);
    const cols = useMemo<ColumnDef<T>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Назва',
                cell: info => {
                    const item = info.row.original;
                    return <ChakraLink asChild variant="underline">
                        <Link prefetch={false} href={`${pathname}/${item.id}`}>
                            {item.name}
                        </Link>
                    </ChakraLink>
                },
            },
            {
                accessorKey: 'count',
                header: 'Предметів',
                enableSorting: false,
                enableColumnFilter: false,
                cell: info => {
                    return info.getValue()
                },
            },
            ...columns,
            ...(canEdit ? [{
                accessorKey: 'id',
                header: 'Дії',
                enableSorting: false,
                enableColumnFilter: false,
                cell: info => {
                    const item = info.row.original;
                    return <Group>
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
                                            })} loading={isSubmitting} colorPalette="red">Видалити</Button>
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
            }] as ColumnDef<T>[] : []),
        ],
        [canEdit, columns, pathname]
    )

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        columns: cols,
        data: items,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onPaginationChange: setPagination,

        //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        state: {
            pagination,
        },
        initialState
        // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
    })
    const { handleSubmit, formState: { isSubmitting } } = useForm();
    return <Table.Root size="sm" variant="outline">
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
            {table.getRowModel().rows.map(row => {
                return (
                    <Table.Row key={row.id}>
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
                    </Table.Row>
                )
            })}
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
}

export default Entities;