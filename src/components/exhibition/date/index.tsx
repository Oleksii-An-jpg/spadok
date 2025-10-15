import {FC, useMemo} from "react";
import {createListCollection, Field, Portal, Select} from "@chakra-ui/react";
import {Control, Controller, useWatch} from "react-hook-form";
import {Item} from "@/models/item";
import {DateType, Part} from "@/lib/utils";
import CenturyPicker from "@/components/exhibition/date/century";
import PartPicker from "@/components/exhibition/date/part";
import FractionPicker from "@/components/exhibition/date/fraction";
import DecadePicker from "@/components/exhibition/date/decade";

type DateProps = {
    control: Control<Item>;
}

const Date: FC<DateProps> = ({ control }) => {
    const dateType = useWatch({
        control,
        name: "date.dateType"
    });
    const part = useWatch({
        control,
        name: "date.part"
    })
    const { dateTypeCollection } = useMemo(() => {
        const dateTypeCollection = createListCollection({
            items: [
                { label: DateType.CENTURIES, value: DateType.CENTURIES},
                { label: DateType.PARTS, value: DateType.PARTS },
                { label: DateType.DECADES, value: DateType.DECADES },
                { label: DateType.YEARS, value: DateType.YEARS },
            ]
        });

        return {
            dateTypeCollection,
        }
    }, []);

    return <>
        <Field.Root orientation="horizontal" required>
            <Field.Label>
                Тип дати
                <Field.RequiredIndicator />
            </Field.Label>
            <Controller
                control={control}
                name="date.dateType"
                render={({ field }) => {
                    return (
                        <Select.Root
                            size="xs"
                            name={field.name}
                            value={[field.value]}
                            onValueChange={({ value }) => field.onChange(...value)}
                            onInteractOutside={() => field.onBlur()}
                            collection={dateTypeCollection}
                        >
                            <Select.HiddenSelect />
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Тип дати" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {dateTypeCollection.items.map((dateType) => (
                                            <Select.Item item={dateType} key={dateType.value}>
                                                {dateType.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    )
                }}
            />
            <Field.HelperText />
            <Field.ErrorText />
        </Field.Root>
        {(() => {
            switch (dateType) {
                case DateType.CENTURIES:
                    return <CenturyPicker control={control} />
                case DateType.PARTS:
                    return <>
                        <PartPicker control={control} />
                        {part !== Part.BEGINNING && part !== Part.END && part !== Part.MIDDLE && (
                            <FractionPicker control={control} />
                        )}
                        <CenturyPicker control={control} />
                    </>
                case DateType.DECADES:
                    return <>
                        <DecadePicker control={control} />
                        <CenturyPicker control={control} />
                    </>
            }
        })()}
    </>
}

export default Date