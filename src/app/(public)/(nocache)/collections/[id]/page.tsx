'use server';

import {getItemsByCategory, getItemsByRegion} from "@/api/items";
import {
    Box, Text, VStack,
    Heading,
    Code,
    List,
    Separator,
    Image,
    Table,
    Blockquote,
    Link as ChakraLink,
    Checkbox, Breadcrumb, Bleed,
} from "@chakra-ui/react";
import Markdown, {Components} from "react-markdown";
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

const ChakraMarkdownComponents: Components = {
    // Headings
    h1: (props) => <Heading as="h1" size="4xl" my={4} {...props} />,
    h2: (props) => <Heading as="h2" size="3xl" my={4} {...props} />,
    h3: (props) => <Heading as="h3" size="2xl" my={3} {...props} />,
    h4: (props) => <Heading as="h4" size="xl" my={3} {...props} />,
    h5: (props) => <Heading as="h5" size="lg" my={2} {...props} />,
    h6: (props) => <Heading as="h6" size="md" my={2} {...props} />,

    // Paragraph
    p: (props) => <Text mb={4} fontSize="sm" {...props} />,

    // Links
    a: (props) => <ChakraLink color="blue.500" {...props} target="_blank" />,

    code: (props) => {
        const { node, className, children, ...rest } = props;

        return <Code
            display="block"
            whiteSpace="pre"
            p={4}
            my={4}
            borderRadius="md"
            overflowX="auto"
            {...rest}
        >
            {children}
        </Code>;
    },

    // Lists
    ul: (props) => <List.Root as="ul" my={4} pl={4} {...props} />,
    ol: (props) => <List.Root as="ol" my={4} pl={4} {...props} />,
    li: (props) => <List.Item fontSize="sm" mb={1} {...props} />,

    // Blockquote
    blockquote: ({ children, ...props }) => (
        <Blockquote.Root
            {...props}
        >
            <Blockquote.Content>
                {children}
            </Blockquote.Content>
        </Blockquote.Root>
    ),

    // Horizontal rule
    hr: () => <Separator my={6} />,

    // Image
    img: (props) => <Image my={4} maxW="100%" {...props} />,

    // Table
    table: (props) => {
        const { children } = props;
        return (
            <Table.Root my={4}>
                {children}
            </Table.Root>
        );
    },
    thead: (props) => <Table.Header {...props} />,
    tbody: (props) => <>{props.children}</>,
    tr: (props) => <Table.Row {...props} />,
    th: (props) => <Table.ColumnHeader {...props} />,
    td: (props) => <Table.Cell {...props} />,

    // Checkbox (for task lists)
    input: (props) => {
        const { node, ...rest } = props;
        if (rest.type === 'checkbox') {
            return <Checkbox.Root readOnly checked={rest.checked} />;
        }
        return <input {...rest} />;
    },
};

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