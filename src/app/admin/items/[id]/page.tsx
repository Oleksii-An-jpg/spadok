'use server';

import {getItem} from "@/api/items";
import Exhibition from "@/components/exhibition";
import {notFound} from "next/navigation";
import {getAuthors} from "@/api/authors";
import {getRegions} from "@/api/regions";
import {getMaterials} from "@/api/materials";
import {getTechniques} from "@/api/techniques";
import {getCategories} from "@/api/categories";
import {getCuts} from "@/api/cuts";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const item = await getItem(id)
    const authors = await getAuthors();
    const regions = await getRegions();
    const materials = await getMaterials();
    const techniques = await getTechniques();
    const categories = await getCategories();
    const cuts = await getCuts();
    if (!item) {
        return notFound();
    }
    return <Exhibition item={item} cuts={cuts} categories={categories} techniques={techniques} materials={materials} regions={regions} authors={authors} />
}