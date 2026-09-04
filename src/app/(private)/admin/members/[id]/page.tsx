'use server';
import {notFound} from "next/navigation";
import {getMember} from "@/api/members";
import Member from "@/components/member";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const member = await getMember(id);

    if (!member) {
        return notFound();
    }

    return <Member member={member} />
}
