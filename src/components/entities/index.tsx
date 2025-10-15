'use client';
import {Group, IconButton, Link as ChakraLink, Table} from "@chakra-ui/react";
import Link from "next/link";
import {BiTrash} from "react-icons/bi";
import {usePathname} from "next/navigation";

type BaseItem = {
    id: string;
    name: string;
}

type EntitiesProps<T> = {
    items: T[];
}

function Entities<T extends BaseItem>({items}: EntitiesProps<T>) {
    const pathname = usePathname();
    return <Table.Root variant="outline">
        <Table.Header>
            <Table.Row>
                <Table.ColumnHeader>Назва</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Дії</Table.ColumnHeader>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {items.map(item => (
                <Table.Row key={item.id}>
                    <Table.Cell>
                        <ChakraLink asChild variant="underline">
                            <Link prefetch={false} href={`${pathname}/${item.id}`}>
                                {item.name}
                            </Link>
                        </ChakraLink>
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                        <Group>
                            <IconButton size="sm" colorPalette="red" variant="outline">
                                <BiTrash />
                            </IconButton>
                        </Group>
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table.Root>
}

export default Entities;