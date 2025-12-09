'use server';
import {notFound} from "next/navigation";
import {getRegion} from "@/api/regions";
import Region from "@/components/region";
import {getItems} from "@/api/items";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const region = await getRegion(id);
    const result = await getItems();
    if (!region) {
        return notFound();
    }

    const items = result.items.filter((item) => item.region.includes(id) || item.subRegions?.includes(id));

    return <Region region={region} items={items} />;
}