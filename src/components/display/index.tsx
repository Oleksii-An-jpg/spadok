'use client';
import {FC} from "react";
import {Box, Text, VStack, Link as ChakraLink, Heading, Grid, GridItem} from "@chakra-ui/react"
import {Item} from "@/models/item";
import {getDisplayPrice} from "@/lib/price";
import Link from "next/link";
import Carousel from "@/components/display/carousel";
import Attributes from "@/components/attributes";
import {Category} from "@/models/category";
import {Region} from "@/models/region";
import isDefined from "@/utils/isDefined";

type DisplayProps = {
    item: Item
    categories: Category[];
    regions: Region[];
}

const Display: FC<DisplayProps> = ({ item, categories, regions }) => {
    const hasRegions = [...item.region, ...(item.subRegions || [])].map(region => regions.find(({ id }) => id === region)).some(item => item?.canFilter);
    return <VStack align="stretch" gap={{ base: 4, xl: 16 }}>
        <Grid gridTemplateColumns={{ base: "auto", xl: "390px auto" }} columnGap={2.5} rowGap={8}>
            <Carousel images={item.images} alt={item.name} />
            <Grid as={GridItem} fontWeight="lighter" gap={{ base: 2, xl: 2.5 }} templateColumns="subgrid" gridColumn="1 / -1">
                <VStack align="stretch" gap={{ base: 1, xl: 2 }} w={{ xl: 390 }}>
                    <Heading className="!leading-10" fontSize={{ base: 'xl', xl: '4xl' }} fontWeight="light">{item.name}</Heading>
                    <Text color="gray.400" fontSize={{ base: 'sm', xl: 'lg' }}>{item.price ? `Врятовано за ${getDisplayPrice(item.price)}` : 'Дарунок'}</Text>
                </VStack>
                <VStack align="stretch" fontSize={{ base: 'xs', xl: 'md' }} gap={3}>
                    <Box>
                        <Text>{[item.address?.state, item.address?.region, item.address?.city]
                            .filter(Boolean)
                            .join(', ')} {item.region?.length && `(${item.regions.map(({ name }) => name).join(', ')})`}.</Text>
                        <Text>{[item.date.part, item.date.fraction, item.date.century && `${item.date.century} ст.`].filter(Boolean).join(' ')}</Text>
                    </Box>
                    <VStack align="stretch" gap={4}>
                        <Text className="first-letter:uppercase">
                            {(item.materials?.length || item.techniques?.length || item.cuts?.length) > 0 &&
                                [item.materials?.join(', '), item.techniques?.join(', '), item.cuts?.join(', ')].join('; ')
                            }
                        </Text>
                        {item.size ? <Text>
                            {item.size}.
                        </Text> : null}
                        {item.description && <Text>
                            {item.description}
                        </Text>}
                        {item.purchase && <Text>
                            {item.purchase}
                        </Text>}
                    </VStack>
                    <ChakraLink asChild variant="underline" color="salmon.500" fontWeight={600} fontSize='sm'>
                        <Link target="_blank" href={item.sourceURL}>
                            Завантажити світлини у високій якості
                        </Link>
                    </ChakraLink>

                    <Box mt={6}>
                        <Attributes attributes={[
                            {
                                name: 'Категорії',
                                collection: [item.mainCategory, ...(item.subCategories || [])].map(category => categories.find(({ id }) => id === category)).map(category => ({
                                    name: category?.name,
                                    ...(category?.canFilter && {
                                        link: `/catalog?Категорії=${category?.id}`,
                                    })
                                })),
                            },
                            ...(hasRegions ? [{
                                name: 'Регіони',
                                collection: [...item.region, ...(item.subRegions || [])].map(region => regions.find(({ id }) => id === region)).filter(isDefined).map(region => ({
                                    name: region?.name,
                                    ...(region?.canFilter && {
                                        link: `/catalog?Регіони=${region?.id}`,
                                    })
                                })),
                            }] : [])
                        ]} />
                    </Box>
                </VStack>
            </Grid>
        </Grid>
    </VStack>
}

export default Display;