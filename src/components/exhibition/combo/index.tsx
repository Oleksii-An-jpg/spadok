'use client'
import {useMemo} from "react";
import {
    Badge,
    Combobox,
    createListCollection,
    Field,
    useFilter,
    useListCollection,
    Wrap,
    Text
} from "@chakra-ui/react";
import {Control, Controller, FieldPath} from "react-hook-form";
import {ItemUIModel} from "@/models/item";

type BaseItem = {
    id: string;
    name: string;
    group?: string;
}

type ComboProps<T> = {
    items: T[];
    label: string;
    placeholder?: string;
    name: FieldPath<ItemUIModel>;
    control: Control<ItemUIModel>;
    required?: boolean;
}

function Combo<T extends BaseItem>({ items, label, control, name, placeholder, required }: ComboProps<T>){
    const { contains } = useFilter({ sensitivity: "base" });
    const formatted = useMemo(() => items.map(item => ({
        label: item.name,
        value: item.id,
        group: item.group
    })), [items]);
    const collection = useMemo(() => {
        return createListCollection({
            items: formatted
        });
    }, [items]);
    const { collection: collectionOfItems, filter } = useListCollection({
        initialItems: formatted,
        filter: contains,
        groupBy: formatted.every(item => item.group) ? (item) => {
            return item.group || ''
        } : undefined,
    });
    const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
        filter(details.inputValue)
    }

    return <Field.Root orientation="horizontal" required={required}>
        <Field.Label alignSelf="start">
            {label}
            {required && <Field.RequiredIndicator />}
        </Field.Label>
        <Controller
            control={control}
            name={name}
            render={({ field }) => <Combobox.Root
                multiple
                size="xs"
                collection={collectionOfItems}
                /* @ts-expect-error something is wrong with the typings */
                value={field.value ? field.value : []}
                onValueChange={({ value }) => field.onChange(value)}
                onInputValueChange={handleInputChange}
                onInteractOutside={() => field.onBlur()}
            >
                <Combobox.Control>
                    <Combobox.Input placeholder={placeholder} />
                    <Combobox.IndicatorGroup>
                        <Combobox.ClearTrigger />
                        <Combobox.Trigger />
                    </Combobox.IndicatorGroup>
                </Combobox.Control>

                <Wrap gap="2">
                    {/* @ts-expect-error something is wrong with the typings */}
                    {field.value?.map((item) => {
                        const label = collection.find(item)?.label;
                        if (!label) {
                            return null
                        }

                        return (
                            <Badge key={item}>{collection.find(item)?.label}</Badge>
                        )
                    })}
                </Wrap>

                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.Empty>Не знайдено</Combobox.Empty>
                        {collectionOfItems.group().map(([group, items]) => (
                            <Combobox.ItemGroup key={group}>
                                <Combobox.ItemGroupLabel>
                                    <Text as="b">{group}</Text>
                                </Combobox.ItemGroupLabel>
                                {items.map((item) => (
                                    <Combobox.Item key={item.value} item={item}>
                                        {item.label}
                                        <Combobox.ItemIndicator />
                                    </Combobox.Item>
                                ))}
                            </Combobox.ItemGroup>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Combobox.Root>}
        />
        <Field.HelperText />
        <Field.ErrorText />
    </Field.Root>
}

export default Combo