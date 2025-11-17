'use server';
import {notFound} from "next/navigation";
import {getTechnique} from "@/api/techniques";
import Technique from "@/components/technique";
import {getItems} from "@/api/items";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const technique = await getTechnique(id);
    const {items} = await getItems({
        where: {
            field: 'techniques',
            operator: 'array-contains',
            value: id
        }
    });
    if (!technique) {
        return notFound();
    }

    return <Technique technique={technique} items={items} />
}