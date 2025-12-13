'use client';

import {FC, useState} from "react";
import {Box, ButtonGroup, Heading, IconButton, Pagination, VStack, Link as ChakraLink, Text} from "@chakra-ui/react";
import ItemComponent from "@/components/items/item";
import {BiLeftArrowAlt, BiRightArrowAlt} from "react-icons/bi";
import BrandButton from "@/components/brand/button";
import Link from "next/link";
import {Item} from "@/models/item";
import clsx from "clsx";

type RelatedProps = {
    items: Item[]
}

const Related: FC<RelatedProps> = ({ items }) => {
    const [page, setPage] = useState(1);
    const pageSize = 2;

    return <VStack align="stretch" gap={8}>
        <Heading fontSize={{ base: 'xl', xl: '3xl' }} fontWeight="light">
            Речі з однієї скрині:
        </Heading>
        <Box columnCount={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={4}>
            {items.map((item, index) => {
                const itemPage = Math.floor(index / pageSize) + 1;
                const isVisibleOnMobile = itemPage === page;

                return <ItemComponent item={item} key={item.id} className={clsx({
                    'hidden xl:block': !isVisibleOnMobile,
                    'block': isVisibleOnMobile
                })} />
            })}
        </Box>
        <Pagination.Root className="block xl:hidden self-center" count={items.length} page={page}
                         onPageChange={(e) => setPage(e.page)} pageSize={2} defaultPage={1}>
            <ButtonGroup variant="ghost" size="2xs">
                <Pagination.PrevTrigger asChild>
                    <IconButton variant="solid"
                                colorPalette="red">
                        <BiLeftArrowAlt className="w-6! h-6!" color="black" />
                    </IconButton>
                </Pagination.PrevTrigger>

                <Text>Сторінка</Text>

                <Pagination.Items
                    render={(page) => (
                        <IconButton colorPalette={{ _selected: 'pink' }}>
                            {page.value}
                        </IconButton>
                    )}
                />

                <Pagination.NextTrigger asChild>
                    <IconButton variant="solid"
                                colorPalette="red">
                        <BiRightArrowAlt className="w-6! h-6!" color="black" />
                    </IconButton>
                </Pagination.NextTrigger>
            </ButtonGroup>
        </Pagination.Root>
        <Box alignSelf="center">
            <BrandButton variant="brand-primary" asChild>
                <ChakraLink asChild variant="underline">
                    <Link prefetch={false} href={`/catalog`}>
                        Більше
                    </Link>
                </ChakraLink>
            </BrandButton>
        </Box>
    </VStack>
}

export default Related