'use client';
import {FC} from "react";
import {Box, Button, Field, Fieldset, Input, InputGroup, VStack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {Founds as FoundsType} from "@/models/founds";
import {db} from "@/lib/client";
import {collection, setDoc, doc} from "@firebase/firestore";

type FoundsProps = {
    values?: FoundsType
}

const Founds: FC<FoundsProps> = ({ values }) => {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FoundsType>({
        defaultValues: values
    });

    return <form onSubmit={handleSubmit(async (data) => {
        const collectionRef = collection(db, 'founds');
        await setDoc(doc(collectionRef, 'default'), data);
        reset(data);
    })}>
        <VStack align="stretch" gap={4}>
            <Fieldset.Root size="sm">
                <Fieldset.Content>
                    <Field.Root orientation="horizontal">
                        <Field.Label>
                            <Field.RequiredIndicator />
                            Зібрано
                        </Field.Label>
                        <InputGroup endAddon="UAH">
                            <Input {...register('raised')} type="number" min={0} step={0.01} />
                        </InputGroup>
                        <Field.HelperText />
                        <Field.ErrorText />
                    </Field.Root>
                    <Field.Root orientation="horizontal">
                        <Field.Label>
                            <Field.RequiredIndicator />
                            Витрачено
                        </Field.Label>
                        <InputGroup endAddon="UAH">
                            <Input {...register('spent')} type="number" min={0} step={0.01} />
                        </InputGroup>
                        <Field.HelperText />
                        <Field.ErrorText />
                    </Field.Root>
                </Fieldset.Content>
            </Fieldset.Root>
            <Box>
                <Button loading={isSubmitting} type="submit">Зберегти</Button>
            </Box>
        </VStack>
    </form>
}

export default Founds;
