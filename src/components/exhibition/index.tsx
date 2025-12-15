'use client';
import {FC, useEffect, useRef, useState} from "react";
import {Item, ItemUIModel, Matureness} from "@/models/item";
import {
    Box,
    Button,
    Card,
    Checkbox,
    CheckboxGroup,
    Container,
    Field,
    FileUpload, Heading,
    HStack,
    Input,
    InputGroup,
    Link as ChakraLink,
    Text,
    Textarea,
    VStack,
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
import ItemsPicker from "@/components/picker";
import ExhibitionDate from "@/components/exhibition/date";
import Gallery from "@/components/exhibition/gallery";
import {Relation} from "@/models/relation";

function itemToFormData(item: Omit<ItemUIModel, 'regions'> & {
    regions: string[];
}): FormData {
    const formData = new FormData();
    const { images, illustrations, ...rest } = item;

    // Append images
    images.forEach((file) => {
        formData.append('images', file);
    });

    if (illustrations) {
        illustrations.forEach(file => {
            formData.append('illustrations', file);
        })
    }

    // Append all other fields
    Object.entries(rest).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            return; // Skip null/undefined
        }

        // Arrays and objects -> JSON
        if (Array.isArray(value) || typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });

    return formData;
}

type ExhibitionProps = {
    item?: Item;
    items: Item[];
    authors: Author[]
    regions: Region[]
    materials: Material[]
    techniques: Technique[]
    categories: Category[]
    cuts: Cut[];
    relation?: Relation
}

const Exhibition: FC<ExhibitionProps> = ({ item, items, relation, authors, regions, materials, techniques, categories, cuts }) => {
    const { images = [], illustrations = [], ...rest } = item || {};
    const { register, watch, reset, formState: { errors, isValid, isSubmitting }, setValue, control, handleSubmit } = useForm<ItemUIModel>({
        defaultValues: rest
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
    const [files, photos] = watch(['images', 'illustrations']);

    useEffect(() => {
        async function parseImages() {
            if (images && images.length > 0) {
                const files = await Promise.all(images.map(async (image) => {
                    const imageUrl = `https://storage.googleapis.com/spadok-images/${image}`
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    return new File([blob], image, {type: blob.type});
                }));
                setValue('images', files);
            }
        }

        parseImages();
    }, [images]);

    useEffect(() => {
        async function parseImages() {
            if (illustrations && illustrations.length > 0) {
                const files = await Promise.all(illustrations.map(async (image) => {
                    const imageUrl = `https://storage.googleapis.com/spadok-images/${image}`
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    return new File([blob], image, {type: blob.type});
                }));
                setValue('illustrations', files);
            }
        }

        parseImages();
    }, [illustrations]);

    useEffect(() => {
        if (map && item?.address) {
            const [mapInstance, markerInstance] = map
            mapInstance.setCenter(item.address.latLng);
            mapInstance.setZoom(10);
            markerInstance.position = item.address.latLng;
        }
    }, [map, item?.address]);
    const mapRef = useRef<HTMLDivElement>(null);

    return <Card.Body css={{ "--field-label-width": '18em'}}>
        <Container maxW="5xl">
            <VStack align="stretch" gap={8}>
                <VStack as="form" align="start" onSubmit={handleSubmit(async (data) => {
                    const formData = itemToFormData({
                        ...data,
                        regions: data.regions.map(region => region.id)
                    });
                    await fetch('/api/items', {
                        method: 'POST',
                        body: formData,
                    });

                    reset(data)
                })} gap={4}>
                    <Field.Root orientation="horizontal" required>
                        <Field.Label>
                            Назва
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <InputGroup>
                            <Input size="xs" autoComplete="off" {...register('name', {
                                required: true
                            })} />
                        </InputGroup>
                        <Field.HelperText />
                        <Field.ErrorText />
                    </Field.Root>
                    <Field.Root orientation="horizontal">
                        <Field.Label>
                            Інвентарний номер
                        </Field.Label>
                        <InputGroup>
                            <Input size="xs" autoComplete="off" {...register('inventory')} />
                        </InputGroup>
                        <Field.HelperText />
                        <Field.ErrorText />
                    </Field.Root>
                    <Field.Root orientation="horizontal">
                        <Field.Label>
                        <span>
                            Опис (<ChakraLink variant="underline" colorPalette="blue" href="https://www.markdownguide.org/basic-syntax/" target="_blank">Markdown base syntax</ChakraLink>)
                        </span>
                        </Field.Label>
                        <Textarea size="xs" autoresize {...register('description')} />
                        <Field.HelperText />
                    </Field.Root>
                    <Field.Root orientation="horizontal" required className="z-10">
                        <Field.Label htmlFor="addressLine">Географічна адреса</Field.Label>
                        <InputGroup>
                            <Controller
                                rules={{ required: true }}
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
                                                        position: {
                                                            lat: 50.450001,
                                                            lng: 30.523333
                                                        }
                                                    })]);
                                                }
                                            }}
                                            onSelectPlace={(_, placeResult) => {
                                                if (placeResult) {
                                                    const address = parseAddress(placeResult);
                                                    const line = getTextFromAddress(address);
                                                    field.onChange(line);

                                                    setValue('address', {
                                                        ...address,
                                                        line,
                                                    });

                                                    if (map) {
                                                        const [mapInstance, markerInstance] = map
                                                        mapInstance.setCenter(address.latLng);
                                                        mapInstance.setZoom(10);
                                                        markerInstance.position = address.latLng;
                                                    }
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
                    <Picker items={authors.map(author => ({
                        name: `${author.firstName} ${author.lastName}`,
                        id: author.id,
                    }))} name="author" control={control} label="Автор" placeholder="Оберіть автора" />
                    <Field.Root orientation="horizontal">
                        <Field.Label>
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
                    <Combo items={categories.filter(category => !category.isCollection)} name="subCategories" control={control} label="Додаткові категорії" placeholder="Оберіть категорії" />
                    <Combo items={categories.filter(category => category.isCollection)} name="subCategories" control={control} label="Підбірки" placeholder="Оберіть підбірки" />
                    <ExhibitionDate control={control} />
                    <Field.Root orientation="horizontal" required>
                        <Field.Label>
                            Посилання на високу якість
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <InputGroup>
                            <Input autoComplete="off" size="xs" {...register('sourceURL', {
                                required: true
                            })} />
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
                    <HStack align="start" w="full">
                        <Text css={{ 'width': 'var(--field-label-width)' }} fontSize="sm">Фотографії</Text>
                        <Box flex={1}>
                            <Controller render={({ field }) => {
                                return <FileUpload.Root onFileChange={({ acceptedFiles }) => {
                                    field.onChange(acceptedFiles);
                                }} acceptedFiles={files} maxFiles={Infinity} accept="image/*">
                                    <FileUpload.HiddenInput />
                                    <Gallery multiple />
                                </FileUpload.Root>
                            }} name="images" control={control} />
                        </Box>
                    </HStack>

                    <Heading>Блок цікавинки</Heading>

                    <Field.Root orientation="horizontal">
                        <Field.Label>
                        <span>
                            Опис (<ChakraLink variant="underline" colorPalette="blue" href="https://www.markdownguide.org/basic-syntax/" target="_blank">Markdown base syntax</ChakraLink>)
                        </span>
                        </Field.Label>
                        <Textarea size="xs" autoresize {...register('facts')} />
                        <Field.HelperText />
                    </Field.Root>

                    <HStack align="start" w="full">
                        <Text css={{ 'width': 'var(--field-label-width)' }} fontSize="sm">Іллюстрації</Text>
                        <Box flex={1}>
                            <Controller render={({ field }) => {
                                return <FileUpload.Root onFileChange={({ acceptedFiles }) => {
                                    field.onChange(acceptedFiles);
                                }} acceptedFiles={photos} maxFiles={Infinity} accept="image/*">
                                    <FileUpload.HiddenInput />
                                    <Gallery multiple />
                                </FileUpload.Root>
                            }} name="illustrations" control={control} />
                        </Box>
                    </HStack>

                    <Button disabled={!isValid} loading={isSubmitting} type="submit">Зберегти</Button>
                </VStack>

                {item && <ItemsPicker submitText="Зберегти пов'язані речі" items={items} onSubmit={async (items) => {
                    await fetch('/api/items/relation', {
                        method: 'PATCH',
                        body: JSON.stringify({
                            related: items,
                            id: item.id
                        }),
                    });
                }} initial={relation?.related || []} />}
            </VStack>
        </Container>
    </Card.Body>
}

export default Exhibition;