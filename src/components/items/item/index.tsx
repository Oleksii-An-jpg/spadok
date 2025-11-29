'use client';
import {Item as ItemModel} from "@/models/item";
import {FC} from "react";
import {Card, LinkOverlay, Text, VStack, Link as ChakraLink} from "@chakra-ui/react";
import Link from "next/link";

type ItemProps = {
    item: ItemModel
}

const Item: FC<ItemProps> = ({ item }) => {
    return <Card.Root unstyled size="sm" key={item.id} className="break-inside-avoid relative">
        <Card.Body>
            <LinkOverlay asChild>
                <ChakraLink asChild variant="plain">
                    <Link prefetch={false} href={`/items/${item.id}`}>
                        <VStack className="relative min-h-10">
                            <img src={`https://storage.googleapis.com/spadok-images/${item.images[0]}`} alt={item.name} />
                            <VStack align="stretch" gap={0.5} className="absolute bottom-2 left-2 mr-2 xl:bottom-6 xl:left-6 xl:mr-6 text-start p-2 bg-khaki">
                                <Text fontSize={{ base: 'xx-small', xl: 'xs' }}>
                                    <Text as="b">{item.name.trim()}</Text>{item.regions[0]?.name && <Text as="span">&nbsp;/&nbsp;{item.regions[0]?.name}</Text>}
                                </Text>
                            </VStack>
                        </VStack>
                    </Link>
                </ChakraLink>
            </LinkOverlay>
        </Card.Body>
    </Card.Root>
}

export default Item;