'use client';
import {FC, useMemo, useEffect} from "react";
import {Controller, useForm, FieldPath} from "react-hook-form";
import {Accordion, createListCollection, Checkmark,
    Listbox, Text,
    useListboxItemContext} from "@chakra-ui/react";
import {Category} from "@/models/category";
import {Cut} from "@/models/cut";
import {Technique} from "@/models/technique";
import {Material} from "@/models/material";
import {Author} from "@/models/author";
import {useRouter} from "next/navigation";
import {Region} from "@/models/region";
import {ListCollection} from "@zag-js/collection";

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

type FacetsProps = {
    categories: Category[];
    cuts: Cut[];
    techniques: Technique[];
    materials: Material[];
    authors: Author[];
    regions: Region[]
}

type Values = {
    categories?: string[];
    cuts?: string[];
    techniques?: string[];
    materials?: string[];
    authors?: string[];
    regions?: string[];
}

type Field = { name: FieldPath<Values>, label: string, collection: ListCollection};

function facetsToQuery(facets: Values) {
    const params = new URLSearchParams();

    for (const [key, values] of Object.entries(facets)) {
        if (!values || values.length === 0) continue;

        for (const v of values) {
            params.append(key, v);
        }
    }

    return params.toString(); // always a string!
}

const Facets: FC<FacetsProps> = (props) => {
    const { control, subscribe } = useForm<Values>();
    const router = useRouter();
    useEffect(() => {
        // make sure to unsubscribe;
        const callback = subscribe({
            formState: {
                values: true,
            },
            callback: ({ values }) => {
                // router.push(`/collections?${facetsToQuery(values)}`);
            },
        })

        return () => callback()

        // You can also just return the subscribe
        // return subscribe();
    }, [subscribe]);
    const fields: Field[] = useMemo(() => {
        const categories: Field = {
            name: 'categories',
            label: 'Категорії',
            collection: createListCollection({
                items: props.categories.map(category => ({
                    value: category.id,
                    label: category.name
                }))
            })
        };
        const cuts: Field = {
            name: 'cuts',
            label: 'Крої',
            collection: createListCollection({
                items: props.cuts.map(cut => ({
                    value: cut.id,
                    label: cut.name
                }))
            })
        };
        const techniques: Field = {
            name: 'techniques',
            label: 'Техніки',
            collection: createListCollection({
                items: props.techniques.map(technique => ({
                    value: technique.id,
                    label: technique.name
                }))
            })
        };
        const materials: Field = {
            name: 'materials',
            label: 'Матеріали',
            collection: createListCollection({
                items: props.materials.map(material => ({
                    value: material.id,
                    label: material.name
                }))
            })
        };
        const authors: Field = {
            name: 'authors',
            label: 'Автори',
            collection: createListCollection({
                items: props.authors.map(author => ({
                    value: author.id,
                    label: `${author.firstName} ${author.lastName}`
                }))
            })
        };
        const regions: Field = {
            name: 'regions',
            label: 'Регіони',
            collection: createListCollection({
                items: props.regions.map(region => ({
                    value: region.id,
                    label: region.name
                }))
            })
        };
        return [
            categories,
            cuts,
            techniques,
            materials,
            authors,
            regions
        ]
    }, [props]);
    return <form>
        {fields.map(entity => (
            <Controller
                key={entity.name}
                control={control}
                name="categories"
                render={({ field  }) => (
                    <Listbox.Root variant="plain" collection={entity.collection} value={field.value}
                                  onValueChange={({ value }) => field.onChange(value)}
                                  selectionMode="multiple">
                        <Accordion.Root size="sm" defaultValue={['categories']} variant="plain" collapsible>
                            <Accordion.Item value={entity.name}>
                                <Accordion.ItemTrigger justifyContent="space-between">
                                    <Listbox.Label><Text fontSize="sm">{entity.label}</Text></Listbox.Label>
                                    <Accordion.ItemIndicator />
                                </Accordion.ItemTrigger>
                                <Accordion.ItemContent>
                                    <Accordion.ItemBody>
                                        <Listbox.Content>
                                            {entity.collection.items.map((item) => (
                                                <Listbox.Item highlightOnHover item={item} key={item.value}>
                                                    <ListboxItemCheckmark />
                                                    <Listbox.ItemText>
                                                        <Text fontSize="xs">
                                                            {item.label}
                                                        </Text>
                                                    </Listbox.ItemText>
                                                </Listbox.Item>
                                            ))}
                                        </Listbox.Content>
                                    </Accordion.ItemBody>
                                </Accordion.ItemContent>
                            </Accordion.Item>
                        </Accordion.Root>
                    </Listbox.Root>
                )}
            />
        ))}
    </form>
}

export default Facets;