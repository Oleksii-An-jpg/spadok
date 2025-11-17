'use client';
import {FC} from "react";
import {Button, Dialog, Portal, CloseButton} from "@chakra-ui/react";
import {Region as RegionModel} from "@/models/region";
import Region from "@/components/region";

type CreateProps = {
    region?: RegionModel
}

const Create: FC<CreateProps> = (props) => {
    return <Dialog.Root size="cover" scrollBehavior="inside">
        <Dialog.Trigger asChild>
            <Button>
                Додати регіон
            </Button>
        </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Додати регіон</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Region {...props} />
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