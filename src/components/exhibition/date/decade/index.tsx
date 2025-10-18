import {FC} from "react";
import {Control} from "react-hook-form";
import {ItemUIModel} from "@/models/item";
import Picker from "@/components/exhibition/picker";

type DecadePickerProps = {
    control: Control<ItemUIModel>
}

const DecadePicker: FC<DecadePickerProps> = ({ control }) => {
    return <Picker items={[
        { name: `00-09`, id: 0 },
        { name: `10-19`, id: 1 },
        { name: `20-29`, id: 2 },
        { name: `30-39`, id: 3 },
        { name: `40-49`, id: 4 },
        { name: `50-59`, id: 5 },
        { name: `60-69`, id: 6 },
        { name: `70-79`, id: 7 },
        { name: `80-89`, id: 8 },
        { name: `90-99`, id: 9 },
    ]} label="Декада" name="date.decade" control={control} required />
}

export default DecadePicker;