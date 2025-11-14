'use client';
import {FC} from "react";
import {Button, Dialog, Portal, CloseButton} from "@chakra-ui/react";
import Category from "@/components/category";
import {Category as CategoryModel} from "@/models/category";

type CreateProps = {
    category?: CategoryModel
}

const Create: FC<CreateProps> = (props) => {
    return <Dialog.Root size="cover" scrollBehavior="inside">
        <Dialog.Trigger asChild>
            <Button>
                Додати категорію
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Додати категорію</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Category {...props} />
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline">Скасувати</Button>
                        </Dialog.ActionTrigger>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    </Dialog.Root>
}

export default Create