'use client';
import {FC} from "react";
import {IconButton, Box, Text, Stack, VStack, Collapsible, Carousel as ChakraCarousel, Link as ChakraLink} from "@chakra-ui/react"
import {BiLeftArrowAlt, BiRightArrowAlt} from "react-icons/bi";
import {Item} from "@/models/item";
import Image from "next/image";
import {getDisplayPrice} from "@/lib/price";
import Link from "next/link";
import Carousel from "@/components/display/carousel";

const items = Array.from({ length: 5 })

type DisplayProps = {
    item: Item
    simple?: boolean
}

const Display: FC<DisplayProps> = ({ item, simple = true }) => {
    return <Stack direction={{ base: 'column', xl: 'row' }} gap={{ base: 4, xl: 16 }}>
        {simple ? <ChakraCarousel.Root slideCount={items.length}>
            <ChakraCarousel.Control justifyContent="center" xl={{ width: 'xl' }}>
                <ChakraCarousel.PrevTrigger asChild>
                    <IconButton colorPalette="red">
                        <BiLeftArrowAlt />
                    </IconButton>
                </ChakraCarousel.PrevTrigger>

                <ChakraCarousel.ItemGroup width="full">
                    {item.images.map((image, index) => (
                        <ChakraCarousel.Item key={index} index={index}>
                            <Box w="100%" h="300px" rounded="lg" fontSize="2.5rem" className="relative">
                                <Image src={`https://storage.googleapis.com/spadok-images/${image}`} className="object-scale-down" alt={item.name} fill />
                            </Box>
                        </ChakraCarousel.Item>
                    ))}
                </ChakraCarousel.ItemGroup>

                <ChakraCarousel.NextTrigger asChild>
                    <IconButton colorPalette="red">
                        <BiRightArrowAlt />
                    </IconButton>
                </ChakraCarousel.NextTrigger>
            </ChakraCarousel.Control>
        </ChakraCarousel.Root> : <Carousel item={item} />}
        <Stack fontWeight="lighter" flex={1} direction={{ base: 'row', xl: 'column' }} columnGap={8} rowGap={3}>
            <VStack align="stretch" gap={0}>
                <Text fontSize={{ base: 'sm', xl: 'md' }}>Врятовано за:</Text>
                <Text fontSize={{ base: 'sm', xl: '2xl' }}>{item.price ? getDisplayPrice(item.price) : 'Дарунок'}</Text>
            </VStack>
            <VStack align="stretch" fontSize={{ base: 'xs', xl: 'md' }} gap={3}>
                <Box>
                    <Text>{item.name}.</Text>
                    <Text>{[item.address?.state, item.address?.region, item.address?.city]
                        .filter(Boolean)
                        .join(', ')} {item.region?.length && `(${item.regions.find(({ id }) => id === item.region[0])?.name})`}.</Text>
                    <Text>{[item.date.part, item.date.fraction, item.date.century && `${item.date.century} ст.`].filter(Boolean).join(' ')}</Text>
                </Box>
                {simple ? <Collapsible.Root>
                    <Collapsible.Trigger className="cursor-pointer underline decoration-dashed">Повний опис</Collapsible.Trigger>
                    <Collapsible.Content mt={4}>
                        {item.purchase}
                    </Collapsible.Content>
                </Collapsible.Root> : <VStack align="stretch" gap={4}>
                    <Text className="first-letter:uppercase">
                        {(item.materials?.length || item.techniques?.length || item.cuts?.length) > 0 &&
                            [item.materials?.join(', '), item.techniques?.join(', '), item.cuts?.join(', ')].join('; ')
                        }
                        {item.size ? <>
                            <br />
                            {item.size}.
                        </> : null}
                    </Text>
                    {item.description && <Text>
                        {item.description}
                    </Text>}
                    {item.purchase && <Text>
                        {item.purchase}
                    </Text>}
                </VStack>}
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