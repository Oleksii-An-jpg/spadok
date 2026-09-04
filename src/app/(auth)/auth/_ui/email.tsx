'use client';

import {FC} from "react";
import {Button, Field, Input, VStack} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/lib/client";

type Values = {
    email: string;
    password: string;
}

type EmailAuthProps = {
    isSignUp: boolean;
}

const EmailAuth: FC<EmailAuthProps> = ({ isSignUp }) => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<Values>({
        mode: 'onChange'
    });

    return <VStack gap={4} asChild>
        <form onSubmit={handleSubmit(async (data) => {
            try {
                if (isSignUp) {
                    await createUserWithEmailAndPassword(auth, data.email, data.password);
                } else {
                    await signInWithEmailAndPassword(auth, data.email, data.password);
                }
            } catch (e) {
                const message = (e as Error).message || 'Не вдалося увійти';

                if (message.includes('password')) {
                    setError('password', { message });
                } else {
                    setError('email', { message });
                }
            }
        })}>
            <Field.Root required invalid={!!errors.email}>
                <Field.Label>Пошта</Field.Label>
                <Input
                    type="email"
                    placeholder="admin@example.com"
                    {...register('email', {
                        required: 'Потрібно вказати електронну пошту',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Недійсна адреса електронної пошти',
                        },
                    })}
                />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root required invalid={!!errors.password}>
                <Field.Label>Пароль</Field.Label>
                <Input
                    type="password"
                    placeholder="••••••••"
                    {...register('password', {
                        required: 'Потрібно вказати пароль',
                        minLength: {
                            value: 6,
                            message: 'Пароль має містити щонайменше 6 символів',
                        },
                    })}
                />
                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>

            <Button type="submit" colorPalette="blue" width="full" loading={isSubmitting}>
                {isSignUp ? 'Створити обліковий запис' : 'Увійти'}
            </Button>
        </form>
    </VStack>
}

export default EmailAuth;
