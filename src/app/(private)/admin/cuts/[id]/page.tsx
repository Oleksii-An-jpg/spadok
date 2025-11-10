'use server';
import {notFound} from "next/navigation";
import {getCut} from "@/api/cuts";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const cut = await getCut(id);
    if (!cut) {
        return notFound();
    }

    return <div>Category: {cut.name}</div>
}