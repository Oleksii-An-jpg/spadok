'use server';

import {getItems} from "@/api/items";
import {Box, Card, Text, VStack,
    Heading,
    Link,
    Code,
    List,
    Separator,
    Image,
    Table,
    Blockquote,
    Checkbox,} from "@chakra-ui/react";
import Markdown, {Components} from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from 'rehype-raw'
import {getCategory} from "@/api/categories";

const ChakraMarkdownComponents: Components = {
    // Headings
    h1: (props) => <Heading as="h1" size="2xl" my={4} {...props} />,
    h2: (props) => <Heading as="h2" size="xl" my={4} {...props} />,
    h3: (props) => <Heading as="h3" size="lg" my={3} {...props} />,
    h4: (props) => <Heading as="h4" size="md" my={3} {...props} />,
    h5: (props) => <Heading as="h5" size="sm" my={2} {...props} />,
    h6: (props) => <Heading as="h6" size="xs" my={2} {...props} />,

    // Paragraph
    p: (props) => <Text mb={4} {...props} />,

    // Links
    a: (props) => <Link color="blue.500" {...props} target="_blank" />,

    // Inline code
    code: (props) => {
        const { node, inline, className, children, ...rest } = props as any;

        return inline ? (
            <Code colorScheme="gray" fontSize="0.875em" {...rest}>
                {children}
            </Code>
        ) : (
            <Code
                display="block"
                whiteSpace="pre"
                p={4}
                my={4}
                borderRadius="md"
                overflowX="auto"
                {...rest}
            >
                {children}
            </Code>
        );
    },

    // Lists
    ul: (props) => <List.Root as="ul" my={4} pl={4} {...props} />,
    ol: (props) => <List.Root as="ol" my={4} pl={4} {...props} />,
    li: (props) => <List.Item mb={1} {...props} />,

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
        const { node, ...rest } = props as any;
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
    const {items} = await getItems({
        category: id
    });

    return (
        <VStack align="stretch">
            <Markdown components={ChakraMarkdownComponents} rehypePlugins={[rehypeRaw, rehypeHighlight]}>{category?.description}</Markdown>
            <Box columnCount={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={4}>
                {items.map((item) => (
                    <Card.Root variant="elevated" size="sm" key={item.id} className="break-inside-avoid mb-4">
                        <Card.Body>
                            <VStack>
                                <img src={`https://storage.googleapis.com/spadok-images/${item.images[0]}`} alt={item.name} />
                                <Text fontSize="sm" className="text-center">{item.name}</Text>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                ))}
            </Box>
        </VStack>
    )
}