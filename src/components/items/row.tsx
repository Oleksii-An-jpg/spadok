'use client';
import {FC, CSSProperties, PropsWithChildren} from "react";
import {
    type UniqueIdentifier,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import { useSortable } from '@dnd-kit/sortable'
import {IconButton, Table} from "@chakra-ui/react";
import {BiMenu} from "react-icons/bi";

type RowProps = {
    row: UniqueIdentifier
}

const RowDragHandleCell: FC<RowProps> = ({ row }) => {
    const { attributes, listeners } = useSortable({
        id: row,
    })
    return (
        <IconButton {...attributes} {...listeners} variant="ghost" cursor="move">
            <BiMenu />
        </IconButton>
    )
}

const Row: FC<PropsWithChildren<RowProps>> = ({ row, children }) => {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row
    });
    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
        transition: transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative',
    }

    return <tr ref={setNodeRef} style={style}>
        {/*<Table.Cell>*/}
        {/*    {row}*/}
        {/*</Table.Cell>*/}
        {/*<Table.Cell>*/}
        {/*    <RowDragHandleCell row={row} />*/}
        {/*</Table.Cell>*/}
        {children}
    </tr>
}

export default Row