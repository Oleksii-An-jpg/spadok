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
import {Author} from "@/models/author";
import {Sex} from "@/models/item";
import {getDateLabel} from "@/lib/utils";
import isDefined from "@/utils/isDefined";

type DisplayProps = {
    item: Item
    categories: Category[];
    regions: Region[];
    author?: Author;
}

const Display: FC<DisplayProps> = ({ item, categories, regions, author }) => {
    const hasRegions = [...item.region, ...(item.subRegions || [])].map(region => regions.find(({ id }) => id === region)).some(item => item?.canFilter);
    // Falls back to the country, which is always known, when the item has no
    // administrative address behind it.
    const place = [item.address?.state, item.address?.region, item.address?.city]
        .filter(Boolean)
        .join(', ') || item.address?.country;
    const ethnographic = item.regions.map(({ name }) => name).join(', ');
    const authorName = author && [author.firstName, author.middleName, author.lastName]
        .map(part => part?.trim())
        .filter(Boolean)
        .join(' ');
    // Groups an item does not have are dropped rather than left as an empty
    // slot, which used to leave a dangling "; ;" behind.
    const madeOf = [item.materials, item.techniques, item.cuts]
        .map(group => group?.join(', '))
        .filter(Boolean)
        .join('; ');
    const date = getDateLabel(item.date);
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
                        {(place || ethnographic) && <Text>
                            {[place, ethnographic && `(${ethnographic})`].filter(Boolean).join(' ')}.
                        </Text>}
                        {date && <Text>{date}</Text>}
                        {authorName && <Text>
                            {author?.sex === Sex.FEMALE ? 'Авторка' : 'Автор'}: {authorName}.
                        </Text>}
                    </Box>
                    <VStack align="stretch" gap={4}>
                        {madeOf && <Text className="first-letter:uppercase">
                            {madeOf}.
                        </Text>}
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