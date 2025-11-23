'use server';

import {getItemsByCategory} from "@/api/items";
import {
    Box, Card, Text, VStack,
    Heading,
    Code,
    List,
    Separator,
    Image,
    Table,
    Blockquote, LinkOverlay,
    Link as ChakraLink,
    Checkbox, Breadcrumb,
} from "@chakra-ui/react";
import Markdown, {Components} from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from 'rehype-raw'
import {getCategory} from "@/api/categories";
import Link from "next/link";
import {BiHome, BiCategory} from "react-icons/bi";
import {notFound} from "next/navigation";

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

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;

    const category = await getCategory(id);
    if (!category) {
        return notFound();
    }
    const {items} = await getItemsByCategory(id);

    return (
        <VStack align="stretch" gap={4}>
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
                        <Breadcrumb.CurrentLink>{category?.name}</Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <Markdown components={ChakraMarkdownComponents} rehypePlugins={[rehypeRaw, rehypeHighlight]}>{category?.description}</Markdown>
            <Box columnCount={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={4}>
                {items.map((item) => {
                    return (
                        <Card.Root variant="elevated" size="sm" key={item.id} className="break-inside-avoid mb-4">
                            <Card.Body>
                                <LinkOverlay asChild>
                                    <ChakraLink asChild variant="plain">
                                        <Link prefetch={false} href={`/items/${item.id}`}>
                                            <VStack>
                                                <img src={`https://storage.googleapis.com/spadok-images/${item.images[0]}`} alt={item.name} />
                                                <VStack gap={0.5}>
                                                    <Text fontSize="sm" className="text-center">{item.name}</Text>
                                                    <Text fontSize="xs" color="gray.500">{item.regions[0].name}</Text>
                                                </VStack>
                                            </VStack>
                                        </Link>
                                    </ChakraLink>
                                </LinkOverlay>
                            </Card.Body>
                        </Card.Root>
                    )
                })}
            </Box>
        </VStack>
    )
}