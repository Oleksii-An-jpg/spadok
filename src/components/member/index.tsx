'use client';
import {FC, useEffect} from "react";
import {
    Box,
    Button,
    Card,
    Container,
    Field,
    FileUpload,
    HStack,
    Input,
    InputGroup,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";
import {Controller, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {Member as MemberModel, MemberUIModel} from "@/models/member";
import Gallery from "@/components/exhibition/gallery";
import {getImageUrl} from "@/lib/images";

function memberToFormData(member: MemberUIModel) {
    const formData = new FormData();
    const { photo, ...rest } = member;

    if (photo instanceof File) {
        formData.append('photo', photo);
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

type MemberProps = {
    member?: MemberModel;
}

const Member: FC<MemberProps> = ({ member }) => {
    const router = useRouter();
    const { photo, ...rest } = member || {};
    const { register, handleSubmit, control, watch, setValue, reset, formState: { isValid, isSubmitting } } = useForm<MemberUIModel>({
        defaultValues: rest
    });
    const [file] = watch(['photo']);

    useEffect(() => {
        async function parseImage() {
            if (photo) {
                const response = await fetch(getImageUrl(photo));
                const blob = await response.blob();
                // legacy photos are stored as /public paths, the bucket keeps flat names
                const name = photo.split('/').pop() as string;
                setValue('photo', new File([blob], name, {type: blob.type}));
            }
        }

        parseImage();
    }, [photo]);

    return <Card.Body css={{ "--field-label-width": '18em'}}>
        <Container maxW="5xl">
            <VStack as="form" align="start" onSubmit={handleSubmit(async (data) => {
                await fetch('/api/members', {
                    method: 'POST',
                    body: memberToFormData(data),
                });

                reset(data);
                router.refresh();
            })} gap={4}>
                <Field.Root orientation="horizontal" required>
                    <Field.Label>
                        Ім’я
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
                <Field.Root orientation="horizontal" required>
                    <Field.Label>
                        Роль
                        <Field.RequiredIndicator />
                    </Field.Label>
                    <InputGroup>
                        <Input size="xs" autoComplete="off" {...register('role', {
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
                        <Textarea size="xs" autoresize autoComplete="off" {...register('description')} />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>
                        Instagram
                    </Field.Label>
                    <InputGroup>
                        <Input size="xs" autoComplete="off" placeholder="https://www.instagram.com/..." {...register('instagram', {
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: 'Посилання має починатися з http(s)://'
                            }
                        })} />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <HStack align="start" w="full">
                    <Text css={{ 'width': 'var(--field-label-width)' }} fontSize="sm">Світлина</Text>
                    <Box flex={1}>
                        <Controller render={({ field }) => {
                            return <FileUpload.Root onFileChange={({ acceptedFiles }) => {
                                field.onChange(...acceptedFiles);
                            }} acceptedFiles={file ? [file] : []} maxFiles={1} accept="image/*">
                                <FileUpload.HiddenInput />
                                <Gallery />
                            </FileUpload.Root>
                        }} name="photo" control={control} />
                    </Box>
                </HStack>
                <Button disabled={!isValid} loading={isSubmitting} type="submit">Зберегти</Button>
            </VStack>
        </Container>
    </Card.Body>
}

export default Member;
