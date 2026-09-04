'use client';
import {FC} from "react";
import {Button, Dialog, Portal, CloseButton} from "@chakra-ui/react";
import Exhibition from "@/components/exhibition";
import {Author} from "@/models/author";
import {Region} from "@/models/region";
import {Material} from "@/models/material";
import {Technique} from "@/models/technique";
import {Category} from "@/models/category";
import {Cut} from "@/models/cut";
import {Item} from "@/models/item";
import {useCanEdit} from "@/components/role";

type CreateProps = {
    authors: Author[]
    regions: Region[]
    materials: Material[]
    techniques: Technique[]
    categories: Category[]
    cuts: Cut[]
    items?: Item[]
}

const Create: FC<CreateProps> = (props) => {
    const canEdit = useCanEdit();

    if (!canEdit) return null;

    return <Dialog.Root size="cover" scrollBehavior="inside">
        <Dialog.Trigger asChild>
            <Button>
                Додати предмет
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Додати предмет</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Exhibition {...props} />
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