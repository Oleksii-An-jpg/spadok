import {Region} from "@/models/region";
import {UniqueIdentifier} from "@dnd-kit/core";
import {Address} from "@/components/places/utils";
import {ExtractedDateInfo} from "@/lib/utils";

export enum Sex {
    MALE = 'Чоловіча',
    FEMALE = 'Жіноча'
}

export enum Matureness {
    ADULT = 'Доросла',
    CHILD = 'Дитяча'
}

type ItemBaseModel= {
    id: UniqueIdentifier;
    name: string;
    description: string;
    purchase: string;
    subRegions: string[];
    regionOfUse: string[];
    sex: Sex[] | null;
    images: string[]
    techniques: string[]
    mainCategory: string;
    subCategories?: string[]
    price?: number
    matureness?: Matureness[]
    sourceURL: string
    size?: string;
    address?: Address;
    materials?: string[]
    author: string;
    cuts: string[];
    published: boolean;
}

export type Item = ItemBaseModel & {
    region: string[];
    regions: Region[];
    date: ExtractedDateInfo;
    sex: Sex[];
}

export type ItemDBModel = ItemBaseModel & {
    region: string[];
    date: string[];
    sex: Sex[] | null;
}