'use server';
import {getCategory} from "@/api/categories";
import {notFound} from "next/navigation";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const category = await getCategory(id);
    if (!category) {
        return notFound();
    }

    return <div>Category: {category.name}</div>
}