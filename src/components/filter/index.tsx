// A typical debounced input react component
import {InputHTMLAttributes, useState, useEffect} from "react";
import {Field, Input, NativeSelect} from "@chakra-ui/react";
import {Column, RowData} from "@tanstack/react-table";

declare module '@tanstack/react-table' {
    //allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select'
    }
}

function DebouncedInput({
                            value: initialValue,
                            onChange,
                            debounce = 500,
                            ...props
                        }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return <Field.Root>
        <Input placeholder="me@example.com" {...props} size="xs" value={value} onChange={e => setValue(e.target.value)} />
    </Field.Root>
}

function Filter<T>({ column }: { column: Column<T> }) {
    const columnFilterValue = column.getFilterValue();
    const { filterVariant } = column.columnDef.meta ?? {};
    const values = Array.from(column.getFacetedUniqueValues().entries()).filter(([value]) => value != null);

    return filterVariant === 'select' ? <NativeSelect.Root size="sm">
        <NativeSelect.Field value={(columnFilterValue) as string} onChange={e => {
            if (e.target.value === 'true' || e.target.value === 'false') {
                column.setFilterValue(JSON.parse(e.target.value));
            } else {
                column.setFilterValue(e.target.value);
            }
        }}>
            <option value="">Усі</option>
            {values.map(([key, value]) => {
                return (
                    <option value={key} key={value}>{typeof key === 'boolean' ? key ? 'Так' : 'Ні' : key == null ? 'Не встановлено' : JSON.stringify(key)}</option>
                )
            })}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
    </NativeSelect.Root> : <DebouncedInput
        onChange={value => column.setFilterValue(value)}
        placeholder={`Пошук...`}
        type="text"
        value={(columnFilterValue ?? '') as string}
    />
}

export default Filter