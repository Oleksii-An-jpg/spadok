'use client';
import {FC} from "react";
import {Technique as TechniqueModel} from "@/models/technique";
import {
    Button,
    Card,
    Container,
    Field,
    Input,
    InputGroup,
    VStack,
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {Item} from "@/models/item";
import Tags from "@/components/tags";

type TechniqueProps = {
    technique?: TechniqueModel
    items: Item[];
}

const Technique: FC<TechniqueProps> = ({ technique, items }) => {
    const { register, handleSubmit, formState: { isValid, isSubmitting } } = useForm<TechniqueModel>({
        defaultValues: technique
    });
    return <Card.Body css={{ "--field-label-width": '18em'}}>
        <Container maxW="5xl">
            <VStack as="form" align="start" onSubmit={handleSubmit(async (data) => {
                return await fetch('/api/techniques', {
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
                <Button disabled={!isValid} loading={isSubmitting} type="submit">Зберегти</Button>
                <Tags items={items} />
            </VStack>
        </Container>
    </Card.Body>
}

export default Technique;