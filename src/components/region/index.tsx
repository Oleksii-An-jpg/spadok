'use client';
import {FC} from "react";
import {Region as RegionModel} from "@/models/region";
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

type RegionProps = {
    region?: RegionModel
}

const Region: FC<RegionProps> = ({ region }) => {
    const { register, handleSubmit, formState: { isValid, isSubmitting } } = useForm<RegionModel>({
        defaultValues: region
    });
    return <Card.Body css={{ "--field-label-width": '18em'}}>
        <Container maxW="5xl">
            <VStack as="form" align="start" onSubmit={handleSubmit(async (data) => {
                return await fetch('/api/regions', {
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

export default Region;