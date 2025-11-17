// A typical debounced input react component
import {InputHTMLAttributes, useState, useEffect} from "react";
import {Field, Input} from "@chakra-ui/react";
import {Column} from "@tanstack/react-table";

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
    const columnFilterValue = column.getFilterValue()

    return <DebouncedInput
        onChange={value => column.setFilterValue(value)}
        placeholder={`Пошук...`}
        type="text"
        value={(columnFilterValue ?? '') as string}
    />
}

export default Filter