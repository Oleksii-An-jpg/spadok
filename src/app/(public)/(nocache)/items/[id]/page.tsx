'use server';

import {getItem, getItems, getRelation} from "@/api/items";
import {notFound} from "next/navigation";
import Display from "@/components/display";
import {Box, Breadcrumb, Link as ChakraLink, Heading, VStack} from "@chakra-ui/react";
import Link from "next/link";
import {BiCategory, BiHome} from "react-icons/bi";
import Attributes from "@/components/attributes";
import {getCategories} from "@/api/categories";
import Item from "@/components/items/item";
import isDefined from "@/utils/isDefined";
import BrandButton from "@/components/brand/button";
import Banner from "@/components/banner";
import {shuffleArray} from "@/utils/shuffle";
import {Metadata, ResolvingMetadata} from "next";
import {getTechniques} from "@/api/techniques";
import {getMaterials} from "@/api/materials";
import {getCuts} from "@/api/cuts";
import {getRegions} from "@/api/regions";

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = (await params).id

    const item = await getItem(id);

    if (!item) {
        return {}
    }

    const { metadataBase, openGraph: parentOG } = await parent;
    const previousImages = parentOG?.images ?? [];

    const currentImage = item.images[0]
        ? {
            url: `https://storage.googleapis.com/spadok-images/${item.images[0]}`,
            secureUrl: `https://storage.googleapis.com/spadok-images/${item.images[0]}`,
        }
        : null;

    const images = currentImage
        ? [currentImage]
        : previousImages;

    return {
        metadataBase,
        title: item.name,
        description: item.description,
        openGraph: {
            title: item.name,
            description: item.description,
            type: "website",
            url: `/items/${id}`,
            images,
        },
        twitter: {
            card: "summary_large_image",
            title: item.name,
            description: item.description,
            images,
        },
    };
}

export default async function Page({params}: Props) {
    const {id} = await params;
    const [item, categories, {items}, relation, techniques, materials, cuts, regions] = await Promise.all([getItem(id), getCategories(), getItems(), getRelation(id), getTechniques(), getMaterials(), getCuts(), getRegions()]);

    if (!item) {
        return notFound();
    }


    const related = relation?.related.map((item) => items.find(({ id }) => id === item)).filter(isDefined);

    // Create a Set of IDs to exclude (the main item + related items)
    const excludeIds = new Set([item.id, ...(related ? related.map((r) => r.id) : [])]);

    // Filter items to exclude those in excludeIds
    const random = shuffleArray(items.filter(({ id }) => !excludeIds.has(id))).slice(0, 10);

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
        <Display simple={false} item={{
            ...item,
            techniques: item.techniques?.map(technique => techniques.find(({ id }) => id === technique)?.name).filter(isDefined),
            materials: item.materials?.map(material => materials.find(({ id }) => id === material)?.name).filter(isDefined),
            cuts: item.cuts?.map(cut => cuts.find(({ id }) => id === cut)?.name).filter(isDefined)
        }} />
        <Attributes attributes={[
            {
                name: 'Категорії',
                collection: [item.mainCategory, ...(item.subCategories || [])].map(category => categories.find(({ id }) => id === category)).map(category => ({
                    name: category?.name,
                    ...(category?.canFilter && {
                        link: `/catalog?Категорії=${category?.id}`,
                    })
                })),
            },
            {
                name: 'Регіони',
                collection: [...item.region, ...item.subRegions].map(region => regions.find(({ id }) => id === region)).filter(isDefined).map(region => ({
                    name: region?.name,
                    link: `/catalog?Регіони=${region?.id}`,
                })),
            },
        ]} />
        {related?.length && (
            <VStack align="stretch" gap={8}>
                <Heading fontSize={{ base: 'xl', xl: '3xl' }} fontWeight="light">
                    Речі з однієї скрині:
                </Heading>
                <Box columnCount={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={4}>
                    {related.map((item) => <Item item={item} key={item.id} />)}
                </Box>
                <Box alignSelf="center">
                    <BrandButton variant="brand-primary" asChild>
                        <ChakraLink asChild variant="underline">
                            <Link prefetch={false} href={`/catalog`}>
                                Більше
                            </Link>
                        </ChakraLink>
                    </BrandButton>
                </Box>
            </VStack>
        )}
        <Banner />

        {random?.length && (
            <VStack align="stretch" gap={8}>
                <Heading fontSize={{ base: 'xl', xl: '3xl' }} fontWeight="light">
                    Вам може сподобатися:
                </Heading>
                <Box columnCount={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={2}>
                    {random.map((item) => <Item item={item} key={item.id} />)}
                </Box>
                <Box alignSelf="center">
                    <BrandButton variant="brand-primary" asChild>
                        <ChakraLink asChild variant="underline">
                            <Link prefetch={false} href={`/catalog`}>
                                Перейти до каталогу
                            </Link>
                        </ChakraLink>
                    </BrandButton>
                </Box>
            </VStack>
        )}
    </VStack>
}
