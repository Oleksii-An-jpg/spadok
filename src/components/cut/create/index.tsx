'use client';
import {FC} from "react";
import {Button, Dialog, Portal, CloseButton} from "@chakra-ui/react";
import {Cut as CutModel} from "@/models/cut";
import Cut from "@/components/cut";

type CreateProps = {
    cut?: CutModel
}

const Create: FC<CreateProps> = (props) => {
    return <Dialog.Root size="cover" scrollBehavior="inside">
        <Dialog.Trigger asChild>
            <Button>
                Додати крій
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Додати крій</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Cut {...props} />
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