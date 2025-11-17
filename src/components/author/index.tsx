'use client';
import {FC} from "react";
import {Author as AuthorModel} from "@/models/author";
import {
    Button,
    Card, RadioGroup,
    Container,
    Field, HStack,
    Input,
    InputGroup, Text, Textarea,
    VStack,
} from "@chakra-ui/react";
import {useForm, Controller} from "react-hook-form";

type AuthorProps = {
    author?: AuthorModel
}

const Author: FC<AuthorProps> = ({ author }) => {
    const { register, handleSubmit, control, formState: { isValid, isSubmitting } } = useForm<AuthorModel>({
        defaultValues: author
    });
    return <Card.Body css={{ "--field-label-width": '18em'}}>
        <Container maxW="5xl">
            <VStack as="form" align="start" onSubmit={handleSubmit(async (data) => {
                return await fetch('/api/authors', {
                    method: 'POST',
                    body: JSON.stringify(data),
                })
            })} gap={4}>
                <Field.Root orientation="horizontal" required>
                    <Field.Label>
                        Прізвище
                        <Field.RequiredIndicator />
                    </Field.Label>
                    <InputGroup>
                        <Input size="xs" autoComplete="off" {...register('lastName', {
                            required: true
                        })} />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>
                        Ім'я
                        <Field.RequiredIndicator />
                    </Field.Label>
                    <InputGroup>
                        <Input size="xs" autoComplete="off" {...register('firstName')} />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label>
                        По батькові
                    </Field.Label>
                    <InputGroup>
                        <Input size="xs" autoComplete="off" {...register('middleName')} />
                    </InputGroup>
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <HStack>
                    <Text css={{ 'width': 'var(--field-label-width)' }} fontSize="sm">Стать</Text>
                    <Controller
                        name="sex"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup.Root
                                orientation="horizontal"
                                name={field.name}
                                value={field.value}
                                onValueChange={({ value }) => {
                                    field.onChange(value)
                                }}
                            >
                                <HStack>
                                    {['Жіноча', 'Чоловіча'].map((item) => (
                                        <RadioGroup.Item key={item} value={item}>
                                            <RadioGroup.ItemHiddenInput />
                                            <RadioGroup.ItemIndicator />
                                            <RadioGroup.ItemText>{item}</RadioGroup.ItemText>
                                        </RadioGroup.Item>
                                    ))}
                                </HStack>
                            </RadioGroup.Root>
                        )} />
                </HStack>
                <Field.Root orientation="horizontal">
                    <Field.Label>
                        Біографія
                    </Field.Label>
                    <Textarea size="xs" autoComplete="off" {...register('description')} />
                    <Field.HelperText />
                    <Field.ErrorText />
                </Field.Root>
                <Button disabled={!isValid} loading={isSubmitting} type="submit">Зберегти</Button>
            </VStack>
        </Container>
    </Card.Body>
}

export default Author;