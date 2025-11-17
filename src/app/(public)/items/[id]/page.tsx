'use server';

import {getItem} from "@/api/items";
import {notFound} from "next/navigation";
import Display from "@/components/display";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const item = await getItem(id);

    if (!item) {
        return notFound();
    }

    return <Display simple={false} item={item} />
}