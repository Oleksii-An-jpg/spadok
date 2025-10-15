'use client';
import {FC, useEffect, useRef, useState} from "react";
import {Item, Matureness} from "@/models/item";
import {
    Button,
    Card,
    Field,
    Input,
    Text,
    Textarea,
    InputGroup,
    VStack,
    Link as ChakraLink,
    Container,
    CheckboxGroup,
    Checkbox,
    HStack,
} from "@chakra-ui/react";
import {Controller, useController, useForm} from "react-hook-form";
import {PlacesAutocompleteInput} from "@/components/places";
import {getTextFromAddress, parseAddress} from "@/components/places/utils";
import {Author} from "@/models/author";
import {Region} from "@/models/region";
import {Material} from "@/models/material";
import {Technique} from "@/models/technique";
import {Category} from "@/models/category";
import {Cut} from "@/models/cut";
import Combo from "@/components/exhibition/combo";
import Picker from "@/components/exhibition/picker";
import Date from "@/components/exhibition/date";

type ExhibitionProps = {
    item: Item
    authors: Author[]
    regions: Region[]
    materials: Material[]
    techniques: Technique[]
    categories: Category[]
    cuts: Cut[]
}

const Exhibition: FC<ExhibitionProps> = ({ item, authors, regions, materials, techniques, categories, cuts }) => {
    const { register, formState: { errors }, reset, control, handleSubmit } = useForm<Item>({
        defaultValues: item
    });

    const sex = useController({
        control,
        name: "sex",
    });
    const matureness = useController({
        control,
        name: 'matureness'
    });
    const [map, setMap] = useState<[google.maps.Map, google.maps.marker.AdvancedMarkerElement]>()

    const mapRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (map && item.address) {
            const [mapInstance, markerInstance] = map
            mapInstance.setCenter(item.address.latLng);
            mapInstance.setZoom(10);
            markerInstance.position = item.address.latLng;
        }
    }, [item.address, map]);

    return <Card.Body css={{ "--field-label-width": '15em'}}>
        <Container maxW="5xl">
            <VStack as="form" align="start" onSubmit={handleSubmit(data => {
                console.log(data);
            })} gap={4}>
                <Field.Root orientation="horizontal" required>
                    <Field.Label>
                        Назва
                        <Field.RequiredIndicator />
                    </Field.Label>
                    <InputGroup>
                        <Input size="xs" {...register('name')} />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <Field.Root orientation="horizontal" required>
                    <Field.Label htmlFor="addressLine">Географічна адреса</Field.Label>
                    <InputGroup>
                        <Controller
                            rules={{ required: "Field is required" }}
                            render={({ field }) => {
                                return (
                                    <PlacesAutocompleteInput
                                        {...field}
                                        invalid={Boolean(errors?.address?.line)}
                                        required
                                        size="xs"
                                        id="addressLine"
                                        onReady={async () => {
                                            const library = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary

                                            if (mapRef.current) {
                                                const mapInstance = new google.maps.Map(mapRef.current, {
                                                    center: {
                                                        lat: 50.450001,
                                                        lng: 30.523333
                                                    },
                                                    zoom: 9,
                                                    disableDefaultUI: true,
                                                    mapId: 'mapId'
                                                });
                                                setMap([mapInstance, new library.AdvancedMarkerElement({
                                                    map: mapInstance,
                                                })]);
                                            }
                                        }}
                                        onSelectPlace={(_, placeResult) => {
                                            if (placeResult) {
                                                const address = parseAddress(placeResult);
                                                const line = getTextFromAddress(address);
                                                field.onChange(line);

                                                reset({
                                                    address: {
                                                        ...address,
                                                        line,
                                                    }
                                                })
                                            }
                                        }}
                                    />
                                );
                            }}
                            name="address.line"
                            control={control}
                        />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label />
                    <div className="w-full h-96" ref={mapRef} />
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>
                        Опис (<ChakraLink variant="underline" colorPalette="blue" href="https://www.markdownguide.org/basic-syntax/" target="_blank">Markdown base syntax</ChakraLink>)
                    </Field.Label>
                    <Textarea size="xs" autoresize {...register('description')} />
                    <Field.HelperText />
                </Field.Root>
                <Picker items={authors.map(author => ({
                    name: `${author.firstName} ${author.lastName}`,
                    id: author.id,
                }))} name="author" control={control} label="Автор" placeholder="Оберіть автора" />
                <Field.Root orientation="horizontal">
                    <Field.Label>
                        <Field.RequiredIndicator />
                        Інформація про купівлю
                    </Field.Label>
                    <InputGroup>
                        <Input size="xs" {...register('purchase')} />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>
                        <Field.RequiredIndicator />
                        Ціна
                    </Field.Label>
                    <InputGroup startAddon="₴" endAddon="UAH">
                        <Input size="xs" {...register('price', {
                            valueAsNumber: true,
                        })} />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>
                        Розмір
                    </Field.Label>
                    <InputGroup>
                        <Input size="xs" {...register('size')} />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <Picker items={regions} name="region" control={control} label="Етнографічний регіон" placeholder="Оберіть регіон" multiple />
                <Picker items={regions} name="subRegions" control={control} label="Додаткові етнографічні регіони" placeholder="Оберіть регіон" multiple />
                <Picker items={regions} name="regionOfUse" control={control} label="Регіони використання" placeholder="Оберіть регіони використання" multiple />
                <HStack>
                    <Text css={{ 'width': 'var(--field-label-width)' }} fontSize="sm">Стать</Text>
                    <CheckboxGroup
                        orientation="horizontal"
                        value={sex.field.value}
                        onValueChange={sex.field.onChange}
                        name={sex.field.name}
                    >
                        {['Жіноча', 'Чоловіча'].map((item) => (
                            <Checkbox.Root key={item} value={item}>
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>{item}</Checkbox.Label>
                            </Checkbox.Root>
                        ))}
                    </CheckboxGroup>
                </HStack>
                <HStack>
                    <Text css={{ 'width': 'var(--field-label-width)' }} fontSize="sm">Вікова категорія</Text>
                    <CheckboxGroup
                        orientation="horizontal"
                        value={matureness.field.value}
                        onValueChange={matureness.field.onChange}
                        name={matureness.field.name}
                    >
                        {[Matureness.CHILD, Matureness.ADULT].map((item) => (
                            <Checkbox.Root key={item} value={item}>
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>{item}</Checkbox.Label>
                            </Checkbox.Root>
                        ))}
                    </CheckboxGroup>
                </HStack>
                <Combo items={materials} name="materials" control={control} label="Матеріали" placeholder="Оберіть матеріали" />
                <Combo items={techniques} label="Техніки виконання" name="techniques" control={control} placeholder="Оберіть техніки" />
                <Combo items={cuts} name="cuts" control={control} label="Крій" placeholder="Оберіть крій" />
                <Picker items={categories} name="mainCategory" control={control} label="Основна категорія" placeholder="Оберіть категорію" />
                <Combo items={categories} name="subCategories" control={control} label="Додаткові категорії" placeholder="Оберіть категорії" />
                <Date control={control} />
                <Field.Root orientation="horizontal" required>
                    <Field.Label>
                        Посилання на високу якість
                        <Field.RequiredIndicator />
                    </Field.Label>
                    <InputGroup>
                        <Input size="xs" {...register('sourceURL')} />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <Controller
                    control={control}
                    name="published"
                    render={({ field }) => (
                        <Field.Root>
                            <Checkbox.Root
                                checked={field.value}
                                onCheckedChange={({ checked }) => field.onChange(checked)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Label css={{ 'width': 'var(--field-label-width)' }}>Опубліковано</Checkbox.Label>
                                <Checkbox.Control />
                            </Checkbox.Root>
                        </Field.Root>
                    )}
                />
                <Button type="submit">Зберегти</Button>
            </VStack>
        </Container>
    </Card.Body>
}

export default Exhibition;