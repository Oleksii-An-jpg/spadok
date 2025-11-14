'use client';
import {Group, IconButton, Dialog, CloseButton, Button, Portal, Link as ChakraLink, Table} from "@chakra-ui/react";
import Link from "next/link";
import {BiTrash} from "react-icons/bi";
import {usePathname} from "next/navigation";
import {useCallback} from "react";
import {useForm} from "react-hook-form";

type BaseItem = {
    id: string;
    name: string;
}

type EntitiesProps<T> = {
    items: T[];
}

function Entities<T extends BaseItem>({items}: EntitiesProps<T>) {
    const pathname = usePathname();
    const handleDelete = useCallback((item: T) => {
        return fetch(`/api/${pathname.replace('/admin', '')}`, {
            method: 'DELETE',
            body: JSON.stringify(item),
        })
    }, []);
    const { handleSubmit, formState: { isSubmitting } } = useForm();
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
                                                Видалення цього елемента є незворотнім. Ви дійсно хочете видалити &quot;{item.name}&quot;?
                                            </Dialog.Body>
                                            <Dialog.Footer>
                                                <Dialog.ActionTrigger asChild>
                                                    <Button variant="outline">Скасувати</Button>
                                                </Dialog.ActionTrigger>
                                                <Button onClick={handleSubmit(() => {
                                                    return handleDelete(item);
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
                    </Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table.Root>
}

export default Entities;