'use server';
import {getCategory} from "@/api/categories";
import {notFound} from "next/navigation";
import Category from "@/components/category";
import {getItemsByCategory} from "@/api/items";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const category = await getCategory(id);
    const {items} = await getItemsByCategory(id)
    if (!category) {
        return notFound();
    }

    return <Category category={category} items={items} />
}