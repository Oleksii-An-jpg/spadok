import {Text, Link as ChakraLink, List, VStack, Heading, LinkOverlay, LinkBox, HStack} from "@chakra-ui/react"
import {Item} from "@/models/item";
import {FC} from "react";
import Link from "next/link";
import Image from "next/image";

type TagsProps = {
    items: Item[]
}

const Tags: FC<TagsProps> = ({ items }) => {
    return (
        <VStack align="stretch">
            <Heading size="md">Предмети, що належать</Heading>
            <List.Root variant="plain">
                {items.map(item => (
                    <List.Item key={item.id}>
                        <LinkBox>
                            <LinkOverlay asChild>
                                <ChakraLink asChild variant="underline">
                                    <Link href={`/admin/items/${item.id}`}>
                                        <HStack gap={2}>
                                            <Image src={`https://storage.googleapis.com/spadok-images/${item.images[0]}`} alt={item.name} width={50} height={50} />
                                            <Text fontSize="xs">{item.name}</Text>
                                        </HStack>
                                    </Link>
                                </ChakraLink>
                            </LinkOverlay>
                        </LinkBox>
                    </List.Item>
                ))}
            </List.Root>
        </VStack>
    )
}

export default Tags;