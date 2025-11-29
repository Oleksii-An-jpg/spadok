'use server';
import {getCategory} from "@/api/categories";
import {notFound} from "next/navigation";
import Category from "@/components/category";
import {getItems} from "@/api/items";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const category = await getCategory(id);
    if (!category) {
        return notFound();
    }

    const {items} = await getItems();

    return <Category category={category} items={items} />
}