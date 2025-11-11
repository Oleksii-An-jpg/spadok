'use client';
import {FC} from "react";
import {Carousel, IconButton, Box, Text, Stack, VStack, Collapsible, Link as ChakraLink} from "@chakra-ui/react"
import {BiLeftArrowAlt, BiRightArrowAlt} from "react-icons/bi";
import {Item} from "@/models/item";
import Image from "next/image";
import {getDisplayPrice} from "@/lib/price";
import Link from "next/link";

const items = Array.from({ length: 5 })

type DisplayProps = {
    item: Item
}

const Display: FC<DisplayProps> = ({ item }) => {
    return <Stack direction={{ base: 'column', xl: 'row' }} gap={{ base: 4, xl: 16 }}>
        <Carousel.Root slideCount={items.length}>
            <Carousel.Control justifyContent="center" xl={{ width: 'xl' }}>
                <Carousel.PrevTrigger asChild>
                    <IconButton colorPalette="red">
                        <BiLeftArrowAlt />
                    </IconButton>
                </Carousel.PrevTrigger>

                <Carousel.ItemGroup width="full">
                    {item.images.map((image, index) => (
                        <Carousel.Item key={index} index={index}>
                            <Box w="100%" h="300px" rounded="lg" fontSize="2.5rem" className="relative">
                                <Image src={`https://storage.googleapis.com/spadok-images/${image}`} className="object-scale-down" alt={item.name} fill />
                            </Box>
                        </Carousel.Item>
                    ))}
                </Carousel.ItemGroup>

                <Carousel.NextTrigger asChild>
                    <IconButton colorPalette="red">
                        <BiRightArrowAlt />
                    </IconButton>
                </Carousel.NextTrigger>
            </Carousel.Control>
        </Carousel.Root>
        <Stack direction={{ base: 'row', xl: 'column' }} columnGap={8} rowGap={3}>
            <VStack align="stretch" gap={0}>
                <Text fontSize={{ base: 'sm', xl: 'md' }}>Вартість:</Text>
                <Text fontSize={{ base: 'sm', xl: '2xl' }}>{item.price ? getDisplayPrice(item.price) : 'Дарунок'}</Text>
            </VStack>
            <VStack align="stretch" fontSize={{ base: 'xs', xl: 'md' }} gap={3}>
                <Box>
                    <Text>{item.name}</Text>
                    <Text>{[item.address?.state, item.address?.region, item.address?.city]
                        .filter(Boolean)
                        .join(', ')} {item.region?.length && `(${item.regions.find(({ id }) => id === item.region[0])?.name})`}.</Text>
                    <Text>{[item.date.part, item.date.fraction, item.date.century && `${item.date.century} ст.`].filter(Boolean).join(' ')}</Text>
                </Box>
                <Collapsible.Root>
                    <Collapsible.Trigger className="cursor-pointer underline decoration-dashed">Повний опис</Collapsible.Trigger>
                    <Collapsible.Content mt={4}>
                        {item.purchase}
                    </Collapsible.Content>
                </Collapsible.Root>
                <ChakraLink asChild variant="underline">
                    <Link target="_blank" href={item.sourceURL}>
                        Завантажити світлини у високій якості
                    </Link>
                </ChakraLink>
            </VStack>
        </Stack>
    </Stack>
}

export default Display;