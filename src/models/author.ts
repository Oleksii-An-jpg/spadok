import {Sex} from "@/models/item";

export type Author = {
    id: string
    description: string
    firstName: string
    lastName: string
    middleName: string
    sex: Sex
    years: string
}