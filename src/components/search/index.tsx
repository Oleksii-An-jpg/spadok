'use client';
import {FC} from "react";
import {useForm} from "react-hook-form";
import {Field, Group, Input, Button} from "@chakra-ui/react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

type SearchProps = {
    query?: string;
}

const Search: FC<SearchProps> = (props) => {
    const router = useRouter();
    const pathname = usePathname();
    const search = useSearchParams();
    const { register, handleSubmit } = useForm<SearchProps>({
        defaultValues: props
    });

    return <form onSubmit={handleSubmit((data) => {
        const params = new URLSearchParams(search);
        if (data.query) {
            params.set('q', data.query);
            router.push(`${pathname}?${params.toString()}`);
        }
    })}>
        <Field.Root>
            <Group attached w="full">
                <Input placeholder="Назва, опис, основна категорія, додаткова категорія і так далі..." autoComplete="off" {...register('query', {
                    required: true
                })} />
                <Button type="submit" variant="outline">
                    Пошук
                </Button>
            </Group>
            <Field.HelperText />
            <Field.ErrorText />
        </Field.Root>
    </form>
}

export default Search;