'use client';

import {FC, useMemo} from "react";
import {Item} from "@/models/item";
import {
    Listbox,
    useFilter,
    useListCollection,
    useListboxItemContext,
    Checkmark,
    Input,
    Grid,
    GridItem,
    Box, VStack, Button
} from "@chakra-ui/react";
import {useForm, Controller} from "react-hook-form";
import Image from "next/image";
import {Category} from "@/models/category";

const ListboxItemCheckmark = () => {
    const itemState = useListboxItemContext()
    return (
        <Checkmark
            filled
            size="sm"
            checked={itemState.selected}
            disabled={itemState.disabled}
        />
    )
}

type PickerProps = {
    items: Item[];
    category: Category;
}

type Values = {
    items: string[]
}

const Picker: FC<PickerProps> = ({ items, category }) => {
    const { contains } = useFilter({ sensitivity: "base" })
    const { collection, filter } = useListCollection({
        initialItems: items.map(item => {
            return {
                label: item.name,
                value: item.id,
                icon: item.images[0],
                description: item.regions[0]?.name
            }
        }),
        filter: contains
    });
    const initial = useMemo(() => {
        return items.filter(item => item.mainCategory === category.id || item.subCategories?.includes(category.id)).map(item => String(item.id))
    }, []);
    const {
        handleSubmit,
        formState: { isSubmitting },
        control,
        reset
    } = useForm<Values>({
        defaultValues: {
            items: initial
        }
    });

    return <VStack as="form" onSubmit={handleSubmit(async (data) => {
        await fetch('/api/items/assign', {
            method: 'PATCH',
            body: JSON.stringify({
                items: data.items,
                category: category.id
            }),
        });

        reset(data);
    })} align="stretch" className="w-full">
        <Controller control={control} render={({ field }) => (
            <Listbox.Root value={field.value ? field.value : []}
                          onValueChange={({ value }) => field.onChange(value)} collection={collection} selectionMode="multiple">
                <Listbox.Label>Оберіть предмети</Listbox.Label>
                <Listbox.Input
                    as={Input}
                    placeholder="Пошук по назві..."
                    onChange={(e) => filter(e.target.value)}
                />
                <Listbox.Content>
                    <Grid gridTemplateColumns="min-content auto auto auto">
                        {collection.items.map((item) => {
                            return (
                                <Grid as={GridItem} templateColumns="subgrid" gridColumn="span 4" key={item.value}>
                                    <Listbox.Item className="grid-cols-subgrid !grid" gridColumn="span 4" item={item}>
                                        <GridItem>
                                            <ListboxItemCheckmark />
                                        </GridItem>
                                        <GridItem>
                                            <Listbox.ItemText>{item.label}</Listbox.ItemText>
                                        </GridItem>
                                        <GridItem>
                                            {item.description}
                                        </GridItem>
                                        <GridItem>
                                            <Box w="100%" h="40px" className="relative">
                                                <Image fill src={`https://storage.googleapis.com/spadok-images/${item.icon}`} className="object-scale-down" alt={item.label} />
                                            </Box>
                                        </GridItem>
                                    </Listbox.Item>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Listbox.Content>
            </Listbox.Root>
        )} name="items" />
        <Button loading={isSubmitting} type="submit">Додати/прибрати підбірку з підкатегорій обраних предметів</Button>
    </VStack>
}

export default Picker;