'use server';
import {notFound} from "next/navigation";
import {getTechnique} from "@/api/techniques";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const technique = await getTechnique(id);
    if (!technique) {
        return notFound();
    }

    return <div>Category: {technique.name}</div>
}