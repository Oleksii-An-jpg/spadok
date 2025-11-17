'use client';
import {FC} from "react";
import {Button, Dialog, Portal, CloseButton} from "@chakra-ui/react";
import {Technique as TechniqueModel} from "@/models/technique";
import Technique from "@/components/technique";

type CreateProps = {
    technique?: TechniqueModel
}

const Create: FC<CreateProps> = (props) => {
    return <Dialog.Root size="cover" scrollBehavior="inside">
        <Dialog.Trigger asChild>
            <Button>
                Додати техніку
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Додати техніку</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Technique {...props} />
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