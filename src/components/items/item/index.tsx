'use client';
import {Item as ItemModel} from "@/models/item";
import {FC} from "react";
import {Card, LinkOverlay, Text, VStack, Link as ChakraLink, Box} from "@chakra-ui/react";
import Link from "next/link";

type ItemProps = {
    item: ItemModel
}

const Item: FC<ItemProps> = ({ item }) => {
    return <Card.Root unstyled size="sm" key={item.id} className="break-inside-avoid relative pb-0.5">
        <Card.Body>
            <LinkOverlay asChild>
                <ChakraLink asChild variant="plain">
                    <Link prefetch={false} href={`/items/${item.id}`}>
                        <VStack className="relative min-h-10">
                            <img src={`https://storage.googleapis.com/spadok-images/${item.images[0]}`} alt={item.name} />
                            <VStack align="stretch" gap={0.5} className="absolute bottom-0 left-0 mr-2 xl:mr-6 text-start p-2 bg-khaki">
                                <Box fontSize={{ base: 'xx-small', xl: 'xs' }}>
                                    <Text fontWeight="bold">{item.name.trim()}</Text>
                                    {/* TODO(@oleksii.a): get rid of this */}
                                    {item.regions[0]?.name !== 'невідомо' && <Text as="span">{item.regions[0]?.name}</Text>}
                                </Box>
                            </VStack>
                        </VStack>
                    </Link>
                </ChakraLink>
            </LinkOverlay>
        </Card.Body>
    </Card.Root>
}

export default Item;