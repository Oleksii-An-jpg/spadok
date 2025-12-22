import {Components} from "react-markdown";
import {
    Text,
    Heading,
    Code,
    List,
    Separator,
    Image,
    Table,
    Blockquote,
    Link as ChakraLink,
    Checkbox
} from "@chakra-ui/react";

const ChakraMarkdownComponents: Components = {
    // Headings
    h1: (props) => <Heading as="h1" size="4xl" my={4} {...props} />,
    h2: (props) => <Heading as="h2" size="3xl" my={4} {...props} />,
    h3: (props) => <Heading as="h3" size="2xl" my={3} {...props} />,
    h4: (props) => <Heading as="h4" size="xl" my={3} {...props} />,
    h5: (props) => <Heading as="h5" size="lg" my={2} {...props} />,
    h6: (props) => <Heading as="h6" size="md" my={2} {...props} />,

    // Paragraph
    p: (props) => <Text mb={4} fontSize="md" {...props} />,

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

export default ChakraMarkdownComponents;