'use client';

import {createContext, CSSProperties, FC, PropsWithChildren, useContext} from "react";
import {UniqueIdentifier} from "@dnd-kit/core";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {IconButton, Table} from "@chakra-ui/react";
import {BiMenu} from "react-icons/bi";

type Sortable = Pick<ReturnType<typeof useSortable>, 'attributes' | 'listeners'>;

/**
 * Lets <DragHandle /> reach the row's drag props without registering a second
 * sortable for the same id.
 */
const SortableRowContext = createContext<Sortable | null>(null);

type SortableRowProps = {
    id: UniqueIdentifier;
    /** Renders a plain row, for read-only users or filtered views. */
    disabled?: boolean;
};

/**
 * A table row that can be dragged inside a <SortableContext />. Only the
 * transform is applied here — the row itself is not a drag target, so text in
 * it stays selectable and links stay clickable; grabbing happens through
 * <DragHandle />.
 */
export const SortableRow: FC<PropsWithChildren<SortableRowProps>> = ({ id, disabled, children }) => {
    const { attributes, listeners, transform, transition, setNodeRef, isDragging } = useSortable({
        id,
        disabled,
    });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative',
    };

    return <SortableRowContext.Provider value={{ attributes, listeners }}>
        <Table.Row ref={setNodeRef} style={style}>
            {children}
        </Table.Row>
    </SortableRowContext.Provider>
}

type DragHandleProps = {
    label?: string;
    disabled?: boolean;
};

/** The grab area for the surrounding <SortableRow />. */
export const DragHandle: FC<DragHandleProps> = ({ label = 'Перетягнути', disabled }) => {
    const sortable = useContext(SortableRowContext);

    if (!sortable) return null;

    return <IconButton
        aria-label={label}
        title={label}
        size="2xs"
        variant="ghost"
        cursor={disabled ? undefined : 'grab'}
        disabled={disabled}
        {...sortable.attributes}
        {...sortable.listeners}
    >
        <BiMenu />
    </IconButton>
}
