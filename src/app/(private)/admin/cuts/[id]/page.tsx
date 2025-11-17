'use server';
import {notFound} from "next/navigation";
import {getCut} from "@/api/cuts";
import Cut from "@/components/cut";
import {getItems} from "@/api/items";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const cut = await getCut(id);
    const {items} = await getItems({
        where: {
            field: 'cuts',
            operator: 'array-contains',
            value: id
        }
    })
    if (!cut) {
        return notFound();
    }

    return <Cut cut={cut} items={items} />
}