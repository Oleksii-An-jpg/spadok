'use client';

import {FC} from "react";
import {Item} from "@/models/item";
import {Group, IconButton, Table, Link as ChakraLink} from "@chakra-ui/react";
import {BiHide, BiTrash} from "react-icons/bi";
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
    return <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={[sensor]}
    >
        <Table.Root variant="outline">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader colSpan={2}>Назва</Table.ColumnHeader>
                    <Table.ColumnHeader>Регіон</Table.ColumnHeader>
                    <Table.ColumnHeader>Дії</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <SortableContext
                    items={order}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map(item => (
                        <Row key={item.id} row={item.id}>
                            <Table.Cell>
                                <ChakraLink asChild variant="underline">
                                    <Link prefetch={false} href={`/admin/items/${item.id}`}>
                                        {item.name}
                                    </Link>
                                </ChakraLink>
                            </Table.Cell>
                            <Table.Cell>{item.regions.map(region => region.name).join(', ')}</Table.Cell>
                            <Table.Cell>
                                <Group>
                                    <IconButton size="sm" variant="outline">
                                        <BiHide />
                                    </IconButton>
                                    <IconButton size="sm" colorPalette="red" variant="outline">
                                        <BiTrash />
                                    </IconButton>
                                </Group>
                            </Table.Cell>
                        </Row>
                    ))}
                </SortableContext>
            </Table.Body>
        </Table.Root>
    </DndContext>
}

export default Items;