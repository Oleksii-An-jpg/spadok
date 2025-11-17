'use client';
import {FC} from "react";
import {Cut as CutModel} from "@/models/cut";
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

type CutProps = {
    cut?: CutModel
    items: Item[];
}

const Cut: FC<CutProps> = ({ cut, items }) => {
    const { register, handleSubmit, formState: { isValid, isSubmitting } } = useForm<CutModel>({
        defaultValues: cut
    });
    return <Card.Body css={{ "--field-label-width": '18em'}}>
        <Container maxW="5xl">
            <VStack as="form" align="start" onSubmit={handleSubmit(async (data) => {
                return await fetch('/api/cuts', {
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

export default Cut;