import {FC} from "react";
import {Control, Controller} from "react-hook-form";
import {Field, Input} from "@chakra-ui/react";
import {ItemUIModel} from "@/models/item";

type YearInputProps = {
    control: Control<ItemUIModel>
}

// The range the century picker covers (XV–XXI).
const MIN_YEAR = 1401;
const MAX_YEAR = 2100;

const YearInput: FC<YearInputProps> = ({ control }) => {
    return <Controller
        control={control}
        name="date.year"
        rules={{
            required: 'Вкажіть рік',
            min: { value: MIN_YEAR, message: `Рік має бути між ${MIN_YEAR} і ${MAX_YEAR}` },
            max: { value: MAX_YEAR, message: `Рік має бути між ${MIN_YEAR} і ${MAX_YEAR}` },
        }}
        render={({ field, fieldState }) => (
            <Field.Root orientation="horizontal" required invalid={!!fieldState.error}>
                <Field.Label>
                    Рік
                    <Field.RequiredIndicator />
                </Field.Label>
                <Input
                    size="xs"
                    type="number"
                    step={1}
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    placeholder="Наприклад, 1934"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value ?? ''}
                    onChange={({ target }) => field.onChange(target.value === '' ? undefined : Math.trunc(Number(target.value)))}
                />
                <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>
            </Field.Root>
        )}
    />
}

export default YearInput;
