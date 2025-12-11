'use client';
import {FC} from "react";
import {Box, Text, VStack, Link as ChakraLink, Heading, Grid, GridItem} from "@chakra-ui/react"
import {Item} from "@/models/item";
import {getDisplayPrice} from "@/lib/price";
import Link from "next/link";
import Carousel from "@/components/display/carousel";

type DisplayProps = {
    item: Item
}

const Display: FC<DisplayProps> = ({ item }) => {
    return <VStack align="stretch" gap={{ base: 4, xl: 16 }}>
        <Grid gridTemplateColumns="390px auto" gap={4}>
            <Carousel item={item} />
            <Grid as={GridItem} fontWeight="lighter" templateColumns="subgrid" gridColumn="span 2" columnGap={8} rowGap={3}>
                <VStack align="stretch" gap={0} w={390}>
                    <Heading lineHeight="normal" fontSize={{ base: 'xl', xl: '5xl' }} fontWeight="light">{item.name}</Heading>
                    <Text color="gray.400" fontSize={{ base: 'sm', xl: 'lg' }}>{item.price ? `Врятовано за ${getDisplayPrice(item.price)}` : 'Дарунок'}</Text>
                </VStack>
                <VStack align="stretch" fontSize={{ base: 'xs', xl: 'md' }} gap={3}>
                    <Box>
                        <Text>{[item.address?.state, item.address?.region, item.address?.city]
                            .filter(Boolean)
                            .join(', ')} {item.region?.length && `(${item.regions.find(({ id }) => id === item.region[0])?.name})`}.</Text>
                        <Text>{[item.date.part, item.date.fraction, item.date.century && `${item.date.century} ст.`].filter(Boolean).join(' ')}</Text>
                    </Box>
                    <VStack align="stretch" gap={4}>
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
                    </VStack>
                    <ChakraLink asChild variant="underline">
                        <Link target="_blank" href={item.sourceURL}>
                            Завантажити світлини у високій якості
                        </Link>
                    </ChakraLink>
                </VStack>
            </Grid>
        </Grid>
    </VStack>
}

export default Display;