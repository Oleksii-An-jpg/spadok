'use client';
import {FC, useEffect} from "react";
import {
    Card,
    VStack,
    Container,
    Field,
    InputGroup,
    Input,
    Textarea,
    Link as ChakraLink,
    Text,
    Box, FileUpload, HStack
} from "@chakra-ui/react";
import {Category as CategoryModel, CategoryUIModel} from "@/models/category";
import {Controller, useForm} from "react-hook-form";
import Gallery from "@/components/exhibition/gallery";

type CategoryProps = {
    category: CategoryModel
}

const Category: FC<CategoryProps> = ({ category }) => {
    const { highlight, ...rest } = category
    const { register, handleSubmit, setValue, watch, control } = useForm<CategoryUIModel>({
        defaultValues: rest
    });
    const file = watch('highlight');
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
                console.log(data)
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
                        <span>
                            Опис (<ChakraLink variant="underline" colorPalette="blue" href="https://www.markdownguide.org/basic-syntax/" target="_blank">Markdown base syntax</ChakraLink>)
                        </span>
                    </Field.Label>
                    <Textarea size="xs" autoresize {...register('description')} />
                    <Field.HelperText />
                </Field.Root>
                <HStack align="start" w="full">
                    <Text css={{ 'width': 'var(--field-label-width)' }} fontSize="sm">Колаж</Text>
                    <Box flex={1}>
                        <Controller render={({ field }) => {
                            return <FileUpload.Root onFileChange={({ acceptedFiles }) => {
                                console.log(acceptedFiles);
                                // field.onChange(acceptedFiles);
                            }} acceptedFiles={file ? [file] : []} maxFiles={1} accept="image/*">
                                <FileUpload.HiddenInput />
                                <Gallery />
                            </FileUpload.Root>
                        }} name="highlight" control={control} />
                    </Box>
                </HStack>
            </VStack>
        </Container>
    </Card.Body>
}

export default Category