'use server';

import {getItemsByCategory, getItemsByRegion} from "@/api/items";
import {
    Box, VStack,
    Breadcrumb, Bleed,
} from "@chakra-ui/react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from 'rehype-raw'
import {getCategory} from "@/api/categories";
import Link from "next/link";
import {BiHome, BiCategory} from "react-icons/bi";
import {notFound} from "next/navigation";
import Item from "@/components/items/item";
import Banner from "@/components/banner";
import {Metadata, ResolvingMetadata} from "next";
import {getRegion} from "@/api/regions";
import { Item as ItemModel } from "@/models/item";
import ChakraMarkdownComponents from "@/components/markdown";

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = (await params).id

    const [category, region] = await Promise.all([getCategory(id), getRegion(id)]);
    let entity

    if (category) {
        entity = category;
    } else if (region) {
        entity = region;
    } else {
        return {}
    }

    const { metadataBase, openGraph: parentOG } = await parent;
    const previousImages = parentOG?.images ?? [];

    const currentImage = entity.highlight
        ? {
            url: `https://storage.googleapis.com/spadok-images/${entity.highlight}`,
            secureUrl: `https://storage.googleapis.com/spadok-images/${entity.highlight}`,
        }
        : null;

    const images = currentImage
        ? [currentImage]
        : previousImages;

    return {
        metadataBase,
        title: entity.name,
        description: entity.description,
        openGraph: {
            title: entity.name,
            description: entity.description,
            type: "website",
            url: `/collection/${id}`,
            images,
        },
        twitter: {
            card: "summary_large_image",
            title: entity.name,
            description: entity.description,
            images,
        },
    };
}

export default async function Page({params}: Props) {
    const {id} = await params;

    const [category, region] = await Promise.all([getCategory(id), getRegion(id)]);
    let entity;
    if (region) {
        entity = region;
    } else if (category) {
        entity = category;
    } else {
        return notFound();
    }
    let items: ItemModel[];
    if (region) {
        const result = await getItemsByRegion(id);

        items = result.items;
    } else {
        const result = await getItemsByCategory(id);
        items = result.items;
    }

    return (
        <VStack align="stretch" gap={4}>
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
                            <Link href="/collections">
                                <BiCategory /> <Box hideBelow="lg">Колекції</Box>
                            </Link>
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink>{entity?.name}</Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <Markdown components={ChakraMarkdownComponents} rehypePlugins={[rehypeRaw, rehypeHighlight]}>{entity?.description}</Markdown>
            <Box columnCount={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={4}>
                {items.map((item) => <Item item={item} key={item.id} />)}
            </Box>
            <Bleed inline="30px">
                <Banner />
            </Bleed>
        </VStack>
    )
}