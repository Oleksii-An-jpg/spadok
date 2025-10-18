import {FC} from "react";
import {Control} from "react-hook-form";
import {ItemUIModel} from "@/models/item";
import {Part} from "@/lib/utils";
import Picker from "@/components/exhibition/picker";

type PartPickerProps = {
    control: Control<ItemUIModel>
}

const PartPicker: FC<PartPickerProps> = ({ control }) => {
    return <Picker items={[
        { name: Part.FIRST, id: Part.FIRST },
        { name: Part.SECOND, id: Part.SECOND },
        { name: Part.THIRD, id: Part.THIRD },
        { name: Part.FOURTH, id: Part.FOURTH },
        { name: Part.LAST, id: Part.LAST },
        { name: Part.BEGINNING, id: Part.BEGINNING },
        { name: Part.MIDDLE, id: Part.MIDDLE },
        { name: Part.END, id: Part.END },
    ]} label="Суфікс" name="date.part" control={control} required />
}

export default PartPicker;