'use server';
import {notFound} from "next/navigation";
import {getRegion} from "@/api/regions";
import Region from "@/components/region";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const region = await getRegion(id);
    if (!region) {
        return notFound();
    }

    return <Region region={region} />;
}