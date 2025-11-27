'use client';
import React, {FC, useMemo, useState, Fragment, useEffect} from "react";
import {
    Accordion,
    Box,
    Text,
    VStack,
    HStack,
    IconButton,
    Heading,
    createListCollection,
    Listbox, useListboxItemContext, Checkmark, GridItem
} from "@chakra-ui/react";
import {
    Table,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFacetedRowModel,
    getFilteredRowModel, //depends on getFacetedRowModel
    getFacetedUniqueValues, //depends on getFacetedRowModel
    PaginationState,
    useReactTable, Column, ColumnFiltersState,
} from '@tanstack/react-table';
import {Item as ItemModel} from "@/models/item";
import {BiLastPage, BiRightArrowAlt, BiFirstPage, BiLeftArrowAlt} from "react-icons/bi";
import {Category} from "@/models/category";
import {Cut} from "@/models/cut";
import {Technique} from "@/models/technique";
import {Material} from "@/models/material";
import {Author} from "@/models/author";
import {Region} from "@/models/region";
import {useSearchParams} from "next/navigation";
import Item from "@/components/items/item";

type ListProps = {
    items: ItemModel[];
    categories: Category[];
    cuts: Cut[];
    techniques: Technique[];
    materials: Material[];
    authors: Author[];
    regions: Region[]
}

type FilterProps = {
    column: Column<ItemModel>;
    table: Table<ItemModel>
}

function buildFilterQuery(filters: ColumnFiltersState) {
    const params = new URLSearchParams();

    filters.forEach(filter => {
        const values = filter.value as Array<string>;
        for (const v of values) {
            params.append(filter.id, v);
        }
    });

    return params.toString();
}

function parseFilters(searchParams: URLSearchParams) {
    const filters: { id: string; value: string[] }[] = [];
    const used = new Set<string>();

    for (const key of searchParams.keys()) {
        if (used.has(key)) continue;
        used.add(key);

        filters.push({
            id: key,
            value: searchParams.getAll(key) // ⬅️ collects all repeated params
        });
    }

    return filters;
}

const ListboxItemCheckmark = () => {
    const itemState = useListboxItemContext()
    return (
        <Checkmark
            filled
            size="sm"
            checked={itemState.selected}
            disabled={itemState.disabled}
        />
    )
}

const Filter: FC<FilterProps> = ({ column, table }) => {
    const columnFilterValue = column.getFilterValue();

    const collection = useMemo(() => {
        // Use table.getCoreRowModel() to get all rows, regardless of current filters
        const rows = table.getCoreRowModel().flatRows;
        const values: { name: string, id: string }[] = rows.map(row => row.getValue(column.id));

        // Remove duplicates and filter out null/undefined
        const uniqueValues = Array.from(new Set(values.filter((value) => value != null)));

        const items = uniqueValues.map((value) => ({
            value: value.id,
            label: value.name
        }));

        return createListCollection({ items });
    }, [table, column.id]);

    return <Accordion.Item value={column.id}>
        <Listbox.Root variant="plain" collection={collection} value={columnFilterValue as string[]}
                      onValueChange={({ value }) => {
                          column.setFilterValue(value);
                      }}
                      selectionMode="multiple">
            <Accordion.ItemTrigger justifyContent="space-between">
                <Listbox.Label>
                    <Text fontSize="sm">{column.id}</Text>
                </Listbox.Label>
                <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
                <Accordion.ItemBody>
                    {collection.items.map((item) => {
                        return (
                            <Listbox.Item highlightOnHover item={item} key={item.value}>
                                <ListboxItemCheckmark />
                                <Listbox.ItemText>
                                    <Text fontSize="xs">
                                        {item.label}
                                    </Text>
                                </Listbox.ItemText>
                            </Listbox.Item>
                        )
                    })}
                </Accordion.ItemBody>
            </Accordion.ItemContent>
        </Listbox.Root>
    </Accordion.Item>
}

const List: FC<ListProps> = ({ items, categories, regions }) => {
    const searchParams = useSearchParams();
    const initialFilters = parseFilters(searchParams);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const columns = useMemo<ColumnDef<ItemModel>[]>(
        () => [
            {
                accessorKey: 'id',
                enableColumnFilter: false,
                cell: info => {
                    const item = info.row.original;
                    return <Item item={item} />;
                }
            },
            {
                id: 'Категорії',
                accessorFn: (row) => {
                    return categories.find(({ id }) => id === row.mainCategory || row.subCategories?.includes(id));
                },
                cell: () => null,
                enableHiding: false,
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue.length === 0) return true;

                    const item = row.original;
                    const category = categories.find(({ id }) =>
                        id === item.mainCategory || item.subCategories?.includes(id)
                    );

                    return category ? filterValue.includes(category.id) : false;
                }
            },
            {
                id: 'Регіони',
                accessorFn: (row) => {
                    return regions.find(({ id }) => row.region.includes(id) || row.subRegions?.includes(id));
                },
                cell: () => null,
                enableHiding: false,
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue.length === 0) return true;

                    const item = row.original;
                    const region = regions.find(({ id }) =>
                        item.region.includes(id) || item.subRegions?.includes(id)
                    );

                    return region ? filterValue.includes(region.id) : false;
                }
            }
        ],
        [items]
    );
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialFilters);
    const table = useReactTable({
        columns,
        data: items,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        state: { pagination, columnFilters },
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(), //if you need a list of values for a column (other faceted row models depend on this one)
        getFacetedUniqueValues: getFacetedUniqueValues(), //if you need a list of unique values
    });
    useEffect(() => {
        window.history.replaceState({}, '', `/catalog?${buildFilterQuery(columnFilters)}`)
    }, [columnFilters]);
    return <>
        <GridItem>
            <VStack align="stretch">
                <Accordion.Root multiple defaultValue={Object.values(initialFilters).filter(v => v.value.length > 0).map(v => v.id)}>
                    {table.getHeaderGroups().map(headerGroup => {
                        return headerGroup.headers.filter(header => header.column.getCanFilter()).map(header => {
                            return <Filter table={table} column={header.column} key={header.id} />
                        })
                    })}
                </Accordion.Root>
            </VStack>
        </GridItem>
        <GridItem>
            <VStack align="stretch">
                <HStack justify="space-between">
                    <Heading>Врятовані речі</Heading>
                    <HStack>
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
                </HStack>
                <Box columnCount={{ base: 2, md: 3, lg: 4 }} gap={2}>
                    {table.getRowModel().rows.map(row => {
                        return <Fragment key={row.id}>
                            {row.getVisibleCells().map(cell => {
                                return <Fragment key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Fragment>
                            })}
                        </Fragment>
                    })}
                </Box>
            </VStack>
        </GridItem>
    </>
}

export default List;