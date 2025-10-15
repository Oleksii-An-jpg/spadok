'use client'
import {useMemo} from "react";
import {
    Badge,
    Combobox,
    createListCollection,
    Field,
    Portal,
    useFilter,
    useListCollection,
    Wrap
} from "@chakra-ui/react";
import {Control, Controller} from "react-hook-form";
import {Item} from "@/models/item";

type BaseItem = {
    id: string;
    name: string;
}

type ComboProps<T> = {
    items: T[];
    label: string;
    placeholder?: string;
    name: string;
    control: Control<Item>;
    required?: boolean;
}

function Combo<T extends BaseItem>({ items, label, control, name, placeholder, required }: ComboProps<T>){
    const { contains } = useFilter({ sensitivity: "base" });
    const collection = useMemo(() => {
        return createListCollection({
            items: items.map(item => ({
                label: item.name,
                value: item.id,
            }))
        });
    }, [items]);
    const { collection: collectionOfItems, filter } = useListCollection({
        initialItems: collection,
        filter: contains,
    });
    const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
        filter(details.inputValue)
    }
    return <Field.Root orientation="horizontal" required={required}>
        <Field.Label>
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
                    {field.value?.map((item) => (
                        <Badge key={item}>{collection.find(item)?.label}</Badge>
                    ))}
                </Wrap>

                <Portal>
                    <Combobox.Positioner>
                        <Combobox.Content>
                            <Combobox.Empty>Не знайдено</Combobox.Empty>
                            {collection.items.map((item) => (
                                <Combobox.Item key={item.value} item={item}>
                                    {item.label}
                                    <Combobox.ItemIndicator />
                                </Combobox.Item>
                            ))}
                        </Combobox.Content>
                    </Combobox.Positioner>
                </Portal>
            </Combobox.Root>}
        />
        <Field.HelperText />
        <Field.ErrorText />
    </Field.Root>
}

export default Combo