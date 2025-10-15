'use server';
import {notFound} from "next/navigation";
import {getMaterial} from "@/api/materials";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const material = await getMaterial(id);
    if (!material) {
        return notFound();
    }

    return <div>Category: {material.name}</div>
}