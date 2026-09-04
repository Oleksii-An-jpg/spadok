'use client';
import React, {FC, useMemo, useState, Fragment, useEffect} from "react";
import {
    Accordion,
    Box,
    Text,
    VStack,
    IconButton,
    Heading,
    createListCollection,
    Listbox, useListboxItemContext, Checkmark, GridItem, ButtonGroup, Pagination, useAccordionItemContext, Icon, Stack
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
import {Item as ItemModel, Matureness, Sex} from "@/models/item";
import {BiRightArrowAlt, BiLeftArrowAlt, BiMinus, BiPlus} from "react-icons/bi";
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

/** Everything else in the query string is a column filter. */
const PAGE_PARAM = 'page';

const PAGE_SIZE = 16;

function buildQuery(filters: ColumnFiltersState, pageIndex: number) {
    const params = new URLSearchParams();

    filters.forEach(filter => {
        const values = filter.value as Array<string>;
        for (const v of values) {
            params.append(filter.id, v);
        }
    });

    // Carried in the URL so coming back from an item lands on the page the
    // visitor left, rather than back at the first one.
    if (pageIndex > 0) {
        params.set(PAGE_PARAM, String(pageIndex + 1));
    }

    return params.toString();
}

function parseFilters(searchParams: URLSearchParams) {
    const filters: { id: string; value: string[] }[] = [];
    const used = new Set<string>();

    for (const key of searchParams.keys()) {
        if (key === PAGE_PARAM || used.has(key)) continue;
        used.add(key);

        filters.push({
            id: key,
            value: searchParams.getAll(key) // ⬅️ collects all repeated params
        });
    }

    return filters;
}

function parsePage(value: string | null) {
    const page = Number(value);
    return Number.isFinite(page) && page > 1 ? Math.floor(page) - 1 : 0;
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

const AccordionItemIcon: FC = () => {
    const { expanded } = useAccordionItemContext();

    return <Icon size="lg">
        {expanded ? <BiMinus /> : <BiPlus />}
    </Icon>
}

/**
 * The pager, rendered both above and below the grid — people were missing the
 * top one, and the cards are too uneven in height for it to sit anywhere fixed.
 */
const Pager: FC<{ table: Table<ItemModel> }> = ({ table }) => {
    const { pageIndex, pageSize } = table.getState().pagination;

    return <Pagination.Root count={table.getFilteredRowModel().rows.length} page={pageIndex + 1}
                            onPageChange={(e) => table.setPageIndex(e.page - 1)} pageSize={pageSize}
                            defaultPage={pageIndex + 1}>
        <ButtonGroup variant="ghost" size={{ base: '2xs', xl: 'xs' }}>
            <Pagination.PrevTrigger asChild>
                <IconButton variant="solid"
                            colorPalette="salmon">
                    <BiLeftArrowAlt className="w-6! h-6!" color="black" />
                </IconButton>
            </Pagination.PrevTrigger>

            <Text fontSize={{ base: '2xs', xl: 'md' }}>Сторінка</Text>

            <Pagination.Items
                render={(page) => (
                    <IconButton colorPalette={{ _selected: 'pink' }}>
                        {page.value}
                    </IconButton>
                )}
            />

            <Pagination.NextTrigger asChild>
                <IconButton variant="solid"
                            colorPalette="salmon">
                    <BiRightArrowAlt className="w-6! h-6!" color="black" />
                </IconButton>
            </Pagination.NextTrigger>
        </ButtonGroup>
    </Pagination.Root>
}

const Filter: FC<FilterProps> = ({ column, table }) => {
    const columnFilterValue = column.getFilterValue() as string[];

    const collection = useMemo(() => {
        const rows = table.getCoreRowModel().flatRows;

        const map = new Map<string, { id: string; name: string }>();

        for (const row of rows) {
            const v = row.getValue(column.id) as { id: string; name: string };

            if (Array.isArray(v)) {
                // accessorFn now returns arrays
                for (const entry of v) {
                    if (entry?.id) {
                        map.set(entry.id, entry);
                    }
                }
            } else if (v?.id) {
                map.set(v.id, v);
            }
        }

        const items = Array.from(map.values()).map(v => ({
            value: v.id,
            label: v.name,
        }));

        return createListCollection({ items });
    }, [table, column.id]);

    return <Accordion.Item css={{ borderBottomWidth: 2 }} value={column.id}>
        <Listbox.Root variant="plain" collection={collection} value={columnFilterValue}
                      onValueChange={({ value }) => {
                          column.setFilterValue(value);
                      }}
                      selectionMode="multiple">
            <Accordion.ItemTrigger justifyContent="space-between">
                <Listbox.Label>
                    <Text fontSize="sm">{column.id} {columnFilterValue?.length ? <Text as="b">({columnFilterValue.length})</Text> : null}</Text>
                </Listbox.Label>
                <AccordionItemIcon />
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

const List: FC<ListProps> = ({ items, categories: rawCategories, regions: rawRegions }) => {
    const searchParams = useSearchParams();
    const initialFilters = parseFilters(searchParams);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: parsePage(searchParams.get(PAGE_PARAM)),
        pageSize: PAGE_SIZE,
    });
    const categories = useMemo(() => rawCategories.filter(category => category.canFilter), [rawCategories])
    const regions = useMemo(() => rawRegions.filter(category => category.canFilter), [rawRegions])
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
                    return categories.filter(({ id }) =>
                        id === row.mainCategory || row.subCategories?.includes(id)
                    );
                },
                cell: () => null,
                enableHiding: false,
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue.length === 0) return true;

                    const itemCats = categories.filter(({ id }) =>
                        id === row.original.mainCategory ||
                        row.original.subCategories?.includes(id)
                    );

                    return itemCats.some(cat => filterValue.includes(cat.id));
                }
            },
            {
                id: 'Регіони',
                accessorFn: (row) => {
                    return regions.filter(({ id }) =>
                        row.region.includes(id) || row.subRegions?.includes(id)
                    );
                },
                cell: () => null,
                enableHiding: false,
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue.length === 0) return true;

                    const item = row.original;

                    // Collect all regions this item belongs to
                    const matched = regions
                        .filter(({ id }) =>
                            item.region.includes(id) || item.subRegions?.includes(id)
                        )
                        .map(r => r.id);

                    // Keep item if ANY matched region is in filterValue
                    return matched.some(id => filterValue.includes(id));
                }
            },
            {
                id: 'Стать',
                accessorKey: 'sex',
                cell: () => null,
                enableHiding: false,
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue.length === 0) return true;

                    const item = row.original;

                    return item.sex?.some(sex => filterValue.includes(sex));
                },
                accessorFn: () => {
                    return [{
                        id: Sex.MALE,
                        name: Sex.MALE,
                    }, {
                        id: Sex.FEMALE,
                        name: Sex.FEMALE
                    }]
                },
            },
            {
                id: 'Вік',
                accessorKey: 'matureness',
                cell: () => null,
                enableHiding: false,
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue.length === 0) return true;

                    const item = row.original;

                    if (!item.matureness) return false;

                    return item.matureness.some(matureness => filterValue.includes(matureness));
                },
                accessorFn: () => {
                    return [{
                        id: Matureness.ADULT,
                        name: Matureness.ADULT,
                    }, {
                        id: Matureness.CHILD,
                        name: Matureness.CHILD
                    }]
                },
            }
        ],
        [items, categories, regions]
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
    const pageCount = table.getPageCount();

    // A page number out of the URL can outrun the list once filters narrow it.
    useEffect(() => {
        const last = Math.max(pageCount - 1, 0);

        if (pagination.pageIndex > last) {
            setPagination(current => ({ ...current, pageIndex: last }));
        }
    }, [pageCount, pagination.pageIndex]);

    useEffect(() => {
        const query = buildQuery(columnFilters, pagination.pageIndex);
        window.history.replaceState({}, '', query ? `/catalog?${query}` : '/catalog')
    }, [columnFilters, pagination.pageIndex]);
    return <>
        <GridItem>
            <VStack align="stretch">
                <Accordion.Root className="border-t-2 xl:hidden" multiple>
                    {table.getHeaderGroups().map(headerGroup => {
                        return headerGroup.headers.filter(header => header.column.getCanFilter()).map(header => {
                            return <Filter table={table} column={header.column} key={header.id} />
                        })
                    })}
                </Accordion.Root>

                <Accordion.Root className="border-t-2 hidden xl:block" multiple defaultValue={table.getAllColumns().map((column) => column.id)}>
                    {table.getHeaderGroups().map(headerGroup => {
                        return headerGroup.headers.filter(header => header.column.getCanFilter()).map(header => {
                            return <Filter table={table} column={header.column} key={header.id} />
                        })
                    })}
                </Accordion.Root>
            </VStack>
        </GridItem>
        <GridItem>
            <VStack align="stretch" gap={8}>
                <Stack direction={{ base: 'column', xl: 'row' }} justify="space-between" className="">
                    <Heading fontSize={{ base: 'xl', xl: '4xl' }} fontWeight="light">
                        Врятовані речі
                    </Heading>
                    <Pager table={table} />
                </Stack>
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
                <Box alignSelf={{ base: 'flex-start', xl: 'center' }}>
                    <Pager table={table} />
                </Box>
            </VStack>
        </GridItem>
    </>
}

export default List;