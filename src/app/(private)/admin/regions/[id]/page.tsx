'use server';
import {notFound} from "next/navigation";
import {getRegion} from "@/api/regions";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const region = await getRegion(id);
    if (!region) {
        return notFound();
    }

    return <div>Category: {region.name}</div>
}