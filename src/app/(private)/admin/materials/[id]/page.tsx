'use server';
import {notFound} from "next/navigation";
import {getMaterial} from "@/api/materials";
import Material from "@/components/material";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const material = await getMaterial(id);
    if (!material) {
        return notFound();
    }

    return <Material material={material} />
}