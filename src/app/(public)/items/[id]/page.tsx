'use server';

import {getItem} from "@/api/items";
import {notFound} from "next/navigation";
import Display from "@/components/display";
import {Breadcrumb, VStack} from "@chakra-ui/react";
import Link from "next/link";
import {BiCategory, BiHome} from "react-icons/bi";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const item = await getItem(id);

    if (!item) {
        return notFound();
    }

    return <VStack align="stretch" gap={8}>
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link asChild>
                        <Link href="/">
                            <BiHome /> Головна
                        </Link>
                    </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Link asChild>
                        <Link href="/collections">
                            <BiCategory /> Каталог
                        </Link>
                    </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.CurrentLink>{item?.name}</Breadcrumb.CurrentLink>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
        <Display simple={false} item={item} />
    </VStack>
}