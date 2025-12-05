'use server';

import {getItem, getItems, getRelation} from "@/api/items";
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
    const [item, authors, regions, materials, techniques, categories, cuts, {items}] = await Promise.all([getItem(id), getAuthors(), getRegions(), getMaterials(), getTechniques(), getCategories(), getCuts(), getItems()]);
    if (!item) {
        return notFound();
    }
    const relation = await getRelation(id);
    return <Exhibition item={item} relation={relation} items={items.filter(item => item.id !== id)} cuts={cuts} categories={categories} techniques={techniques} materials={materials} regions={regions} authors={authors} />
}