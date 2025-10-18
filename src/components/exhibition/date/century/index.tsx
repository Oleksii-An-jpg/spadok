import {FC} from "react";
import {Control} from "react-hook-form";
import {ItemUIModel} from "@/models/item";
import {Century} from "@/lib/utils";
import Picker from "@/components/exhibition/picker";

type CenturyPickerProps = {
    control: Control<ItemUIModel>
}

const CenturyPicker: FC<CenturyPickerProps> = ({ control }) => {
    return <Picker items={[
        { name: Century.XV, id: Century.XV },
        { name: Century.XVI, id: Century.XVI },
        { name: Century.XVII, id: Century.XVII },
        { name: Century.XVIII, id: Century.XVIII },
        { name: Century.XIX, id: Century.XIX },
        { name: Century.XX, id: Century.XX },
        { name: Century.XXI, id: Century.XXI },
    ]} label="Століття" name="date.century" control={control} required />;
}

export default CenturyPicker;