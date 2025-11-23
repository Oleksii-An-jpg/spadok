'use client';
import {FC, useMemo, useState, Fragment } from "react";
import {Box, Card, LinkOverlay, Text, VStack, HStack, IconButton, Link as ChakraLink} from "@chakra-ui/react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    useReactTable,
} from '@tanstack/react-table';
import Link from "next/link";
import {Item} from "@/models/item";
import {BiLastPage, BiRightArrowAlt, BiFirstPage, BiLeftArrowAlt} from "react-icons/bi";

type ListProps = {
    items: Item[]
}

const List: FC<ListProps> = ({ items }) => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const columns = useMemo<ColumnDef<Item>[]>(
        () => [
            {
                accessorKey: 'id',
                cell: info => {
                    const item = info.row.original;
                    return (
                        <Card.Root size="sm" className="break-inside-avoid mb-2">
                            <Card.Body>
                                <LinkOverlay asChild>
                                    <ChakraLink asChild variant="plain">
                                        <Link prefetch={false} href={`/items/${item.id}`}>
                                            <VStack>
                                                <img src={`https://storage.googleapis.com/spadok-images/${item.images[0]}`} alt={item.name} />
                                                <VStack gap={0.5}>
                                                    <Text fontSize="xs" className="text-center">{item.name}</Text>
                                                    {item.regions?.[0] && <Text className="text-center" fontSize="2xs" color="gray.500">{item.regions[0].name}</Text>}
                                                </VStack>
                                            </VStack>
                                        </Link>
                                    </ChakraLink>
                                </LinkOverlay>
                            </Card.Body>
                        </Card.Root>
                    );
                }
            }
        ],
        [items]
    );
    const table = useReactTable({
        columns,
        data: items,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: { pagination },
    });
    return <VStack align="stretch">
        <VStack align="stretch">
            <HStack justify="end">
                <Text fontSize="xs">Сторінка {table.getState().pagination.pageIndex + 1} із {table.getPageCount()}</Text>
                <IconButton
                    size="2xs"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <BiFirstPage />
                </IconButton>
                <IconButton
                    size="2xs"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <BiLeftArrowAlt />
                </IconButton>
                <IconButton
                    size="2xs"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <BiRightArrowAlt />
                </IconButton>
                <IconButton
                    size="2xs"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <BiLastPage />
                </IconButton>
            </HStack>
        </VStack>
        <Box columnCount={{ base: 2, md: 3, lg: 5, xl: 6 }} gap={2}>
            {table.getRowModel().rows.map(row => {
                return <Fragment key={row.id}>
                    {row.getVisibleCells().map(cell => <Fragment key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Fragment>)}
                </Fragment>
            })}
        </Box>
    </VStack>
}

export default List;