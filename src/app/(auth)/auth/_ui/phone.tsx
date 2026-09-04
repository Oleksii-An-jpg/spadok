'use client';

import {FC, useState} from "react";
import {Button, Field, Input, VStack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";
import {auth} from "@/lib/client";
import Verification from "./verification";

type Values = {
    phone: string;
}

const PhoneAuth: FC = () => {
    const { register, handleSubmit, formState: { errors, isValid, isSubmitting }, setError } = useForm<Values>({
        mode: 'onChange'
    });
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    if (confirmationResult) {
        return <VStack gap={4}>
            <Verification result={confirmationResult} onRestart={() => setConfirmationResult(null)} />
        </VStack>
    }

    return <VStack gap={4} asChild>
        <form onSubmit={handleSubmit(async (data) => {
            // A verifier can only be solved once, so each attempt gets a fresh one.
            const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
            });

            try {
                setConfirmationResult(await signInWithPhoneNumber(auth, data.phone, recaptchaVerifier));
            } catch (e) {
                recaptchaVerifier.clear();
                setError('phone', { message: (e as Error).message || 'Не вдалося надіслати код підтвердження' });
            }
        })}>
            <Field.Root required invalid={!!errors.phone}>
                <Field.Label>Телефон</Field.Label>
                <Input
                    type="tel"
                    placeholder="+380501234567"
                    {...register('phone', {
                        required: 'Потрібно вказати телефон',
                        setValueAs(value: string) {
                            return value.split(' ').join('')
                        },
                        pattern: {
                            value: /^\+[1-9]\d{1,14}$/,
                            message: 'Недійсний формат номера телефону',
                        },
                    })}
                />
                <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                <Field.HelperText>Вкажіть код країни (наприклад, +380 для України)</Field.HelperText>
            </Field.Root>

            <Button disabled={!isValid} type="submit" colorPalette="blue" width="full" loading={isSubmitting}>
                Надіслати код підтвердження
            </Button>

            <div id="recaptcha-container" />
        </form>
    </VStack>
}

export default PhoneAuth;
