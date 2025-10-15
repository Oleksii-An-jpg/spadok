import {createListCollection, Field, Portal, Select} from "@chakra-ui/react";
import {Control, Controller, FieldPath} from "react-hook-form";
import {useMemo} from "react";
import {Item} from "@/models/item";

type BaseItem = {
    id: string | number;
    name: string;
}

type PickerProps<T> = {
    items: T[];
    label: string;
    placeholder?: string;
    name: FieldPath<Item>;
    control: Control<Item>;
    required?: boolean;
    multiple?: boolean;
}

function Picker<T extends BaseItem>({ items, control, name, label, required, placeholder, multiple }: PickerProps<T>) {
    const collection = useMemo(() => {
        return createListCollection({
            items: items.map(item => ({
                label: item.name,
                value: item.id,
            })),
        });
    }, [items]);
    return <Field.Root orientation="horizontal" required={required}>
        <Field.Label>
            {label}
            {required && <Field.RequiredIndicator />}
        </Field.Label>
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                return (
                    <Select.Root
                        size="xs"
                        name={field.name}
                        {...multiple ? {
                            multiple: true,
                            value: field.value,
                            onValueChange: ({ value }) => field.onChange(value)
                        } : {
                            multiple: false,
                            value: [field.value],
                            onValueChange: ({ value }) => field.onChange(...value),
                        }}
                        onInteractOutside={() => field.onBlur()}
                        /* @ts-expect-error something is wrong with the typings */
                        collection={collection}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder={placeholder} />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {collection.items.map((item) => (
                                        <Select.Item item={item} key={item.value}>
                                            {item.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                )
            }}
        />
        <Field.HelperText />
        <Field.ErrorText />
    </Field.Root>
}

export default Picker;