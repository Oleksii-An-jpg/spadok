'use client';

import {FC} from "react";
import {Alert, Button, Field, PinInput, VStack} from "@chakra-ui/react";
import {Controller, useForm} from "react-hook-form";
import {ConfirmationResult} from "firebase/auth";

type Values = {
    code: string[];
}

type VerificationProps = {
    result: ConfirmationResult;
    onRestart: () => void;
}

const Verification: FC<VerificationProps> = ({ result, onRestart }) => {
    const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<Values>({
        defaultValues: { code: [] }
    });

    return <VStack asChild gap={4}>
        <form onSubmit={handleSubmit(async (data) => {
            try {
                await result.confirm(data.code.join(''));
            } catch (e) {
                setError('code', { message: (e as Error).message || 'Не вдалося підтвердити код' });
            }
        })}>
            <Alert.Root status="info">
                <Alert.Indicator />
                <Alert.Description>
                    Введіть 6-значний код, надісланий на ваш телефон
                </Alert.Description>
            </Alert.Root>

            <Field.Root orientation="horizontal" invalid={!!errors.code}>
                <Field.Label>Код (смс)</Field.Label>
                <Controller
                    control={control}
                    name="code"
                    render={({ field }) => (
                        <PinInput.Root
                            w="full"
                            value={field.value}
                            onValueChange={(e) => field.onChange(e.value)}
                        >
                            <PinInput.HiddenInput />
                            <PinInput.Control>
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <PinInput.Input key={index} index={index} />
                                ))}
                            </PinInput.Control>
                        </PinInput.Root>
                    )}
                />
                <Field.ErrorText>{errors.code?.message}</Field.ErrorText>
            </Field.Root>

            <Button type="submit" colorPalette="blue" width="full" loading={isSubmitting}>
                Підтвердити код
            </Button>

            <Button variant="ghost" width="full" type="button" onClick={onRestart}>
                Використати інший номер
            </Button>
        </form>
    </VStack>
}

export default Verification;
