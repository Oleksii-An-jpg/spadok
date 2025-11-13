'use server';

import {getItems} from "@/api/items";
import {Box, Card, Text, VStack} from "@chakra-ui/react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import {getCategory} from "@/api/categories";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;

    const category = await getCategory(id);
    const {items} = await getItems({
        category: id
    });

    return (
        <VStack align="stretch">
            <Markdown rehypePlugins={[rehypeHighlight]}>{category?.description}</Markdown>
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