'use server';
import {notFound} from "next/navigation";
import {getMaterial} from "@/api/materials";
import Material from "@/components/material";
import {getItems} from "@/api/items";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const material = await getMaterial(id);
    const {items} = await getItems({
        where: {
            field: 'materials',
            operator: 'array-contains',
            value: id
        }
    });
    if (!material) {
        return notFound();
    }

    return <Material material={material} items={items} />
}