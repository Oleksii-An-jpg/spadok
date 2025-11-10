'use server';
import {notFound} from "next/navigation";
import {getAuthor} from "@/api/authors";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const author = await getAuthor(id);
    if (!author) {
        return notFound();
    }

    return <div>Category: {author.firstName}</div>
}