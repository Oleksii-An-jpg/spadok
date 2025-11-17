'use server';
import {notFound} from "next/navigation";
import {getCut} from "@/api/cuts";
import Cut from "@/components/cut";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const cut = await getCut(id);
    if (!cut) {
        return notFound();
    }

    return <Cut cut={cut} />
}