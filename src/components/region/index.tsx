'use client';
import {FC, useEffect} from "react";
import {Region as RegionModel, RegionUIModel} from "@/models/region";
import {
    Box,
    Button,
    Card, Checkbox,
    Container,
    Field, FileUpload, HStack,
    Input,
    InputGroup, Text, Textarea,
    VStack,
} from "@chakra-ui/react";
import {Controller, useForm} from "react-hook-form";
import {Item} from "@/models/item";
import Tags from "@/components/tags";
import Gallery from "@/components/exhibition/gallery";

type RegionProps = {
    region?: RegionModel;
    items?: Item[]
}

function regionToFormData(region: RegionUIModel) {
    const formData = new FormData();
    const { highlight, ...rest } = region;

    if (highlight instanceof File) {
        formData.append('highlight', highlight);
    }

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

const Region: FC<RegionProps> = ({ region, items }) => {
    const { highlight, ...rest } = region || {};
    const { register, handleSubmit, control, watch, setValue, formState: { isValid, isSubmitting } } = useForm<RegionUIModel>({
        defaultValues: rest
    });
    const [file] = watch(['highlight']);

    useEffect(() => {
        async function parseImage() {
            if (highlight) {
                const imageUrl = `https://storage.googleapis.com/spadok-images/${highlight}`
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], highlight, {type: blob.type});
                setValue('highlight', file);
            }
        }

        parseImage();
    }, [highlight]);
    return <Card.Body css={{ "--field-label-width": '18em'}}>
        <Container maxW="5xl">
            <VStack as="form" align="start" onSubmit={handleSubmit(async (data) => {
                return await fetch('/api/regions', {
                    method: 'POST',
                    body: regionToFormData(data),
                })
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
                        Опис
                    </Field.Label>
                    <InputGroup>
                        <Textarea size="xs" autoComplete="off" {...register('description')} />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <HStack align="start" w="full">
                    <Text css={{ 'width': 'var(--field-label-width)' }} fontSize="sm">Ілюстрація</Text>
                    <Box flex={1}>
                        <Controller render={({ field }) => {
                            return <FileUpload.Root onFileChange={({ acceptedFiles }) => {
                                field.onChange(...acceptedFiles);
                            }} acceptedFiles={file ? [file] : []} maxFiles={1} accept="image/*">
                                <FileUpload.HiddenInput />
                                <Gallery />
                            </FileUpload.Root>
                        }} name="highlight" control={control} />
                    </Box>
                </HStack>
                <Controller
                    control={control}
                    name="isCollection"
                    shouldUnregister
                    render={({ field }) => (
                        <Field.Root>
                            <Checkbox.Root
                                checked={field.value}
                                onCheckedChange={({ checked }) => field.onChange(checked)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Label css={{ 'width': 'var(--field-label-width)' }}>Підбірка</Checkbox.Label>
                                <Checkbox.Control />
                            </Checkbox.Root>
                        </Field.Root>
                    )}
                />
                <Controller
                    control={control}
                    name="canFilter"
                    shouldUnregister
                    render={({ field }) => (
                        <Field.Root>
                            <Checkbox.Root
                                checked={field.value}
                                onCheckedChange={({ checked }) => field.onChange(checked)}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Label css={{ 'width': 'var(--field-label-width)' }}>На фільтрах</Checkbox.Label>
                                <Checkbox.Control />
                            </Checkbox.Root>
                        </Field.Root>
                    )}
                />
                <Button disabled={!isValid} loading={isSubmitting} type="submit">Зберегти</Button>
                {items && <Tags items={items} />}
            </VStack>
        </Container>
    </Card.Body>
}

export default Region;