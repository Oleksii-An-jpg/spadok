'use server';
import {notFound} from "next/navigation";
import {getAuthor} from "@/api/authors";
import Author from "@/components/author";
import {getItems} from "@/api/items";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const author = await getAuthor(id);
    const {items} = await getItems({
        where: {
            field: 'author',
            operator: '==',
            value: id
        }
    })
    if (!author) {
        return notFound();
    }

    return <Author author={author} items={items} />
}