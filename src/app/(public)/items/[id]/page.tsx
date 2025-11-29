'use server';

import {getItem} from "@/api/items";
import {notFound} from "next/navigation";
import Display from "@/components/display";
import {Box, Breadcrumb, VStack} from "@chakra-ui/react";
import Link from "next/link";
import {BiCategory, BiHome} from "react-icons/bi";
import Attributes from "@/components/attributes";
import {getCategories} from "@/api/categories";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;
    const [item, categories] = await Promise.all([getItem(id), getCategories()]);

    if (!item) {
        return notFound();
    }

    return <VStack align="stretch" gap={8}>
        <Breadcrumb.Root>
            <Breadcrumb.List>
                <Breadcrumb.Item>
                    <Breadcrumb.Link asChild>
                        <Link href="/">
                            <BiHome /> <Box hideBelow="lg">Головна</Box>
                        </Link>
                    </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                    <Breadcrumb.Link asChild>
                        <Link href="/catalog">
                            <BiCategory /> <Box hideBelow="lg">Каталог</Box>
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
        <Attributes attributes={[
            {
                name: 'Категорії',
                collection: [item.mainCategory, ...(item.subCategories || [])].map(category => ({
                    name: categories.find(({ id }) => id === category)?.name,
                    link: `/catalog`
                }))
            },
            {
                name: 'Регіони',
                collection: item.regions.map(region => ({
                    name: region.name,
                    link: `/catalog`
                }))
            },
        ]} />
    </VStack>
}
