'use client';
import {FC} from "react";
import {Material as MaterialModel} from "@/models/material";
import {
    Button,
    Card,
    Container,
    Field,
    Input,
    InputGroup, Textarea,
    VStack,
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";

type MaterialProps = {
    material?: MaterialModel
}

const Material: FC<MaterialProps> = ({ material }) => {
    const { register, handleSubmit, formState: { isValid, isSubmitting } } = useForm<MaterialModel>({
        defaultValues: material
    });
    return <Card.Body css={{ "--field-label-width": '18em'}}>
        <Container maxW="5xl">
            <VStack as="form" align="start" onSubmit={handleSubmit(async (data) => {
                return await fetch('/api/materials', {
                    method: 'POST',
                    body: JSON.stringify(data),
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
                <Button disabled={!isValid} loading={isSubmitting} type="submit">Зберегти</Button>
            </VStack>
        </Container>
    </Card.Body>
}

export default Material;