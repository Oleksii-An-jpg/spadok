import {FC} from "react";
import {Control} from "react-hook-form";
import {ItemUIModel} from "@/models/item";
import {Fraction} from "@/lib/utils";
import Picker from "@/components/exhibition/picker";

type FractionPickerProps = {
    control: Control<ItemUIModel>
}

const FractionPicker: FC<FractionPickerProps> = ({ control }) => {
    return <Picker label="Частина" name="date.fraction" control={control} items={[
        { name: Fraction.QUARTER, id: Fraction.QUARTER },
        { name: Fraction.THIRD, id: Fraction.THIRD },
        { name: Fraction.HALF, id: Fraction.HALF },
    ]} required />
}

export default FractionPicker;