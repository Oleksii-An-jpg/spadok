'use server';

import {getCategories} from "@/api/categories";
import {
    VStack,
    Breadcrumb,
    HStack,
    Grid,
    Heading, GridItem, Box
} from "@chakra-ui/react";
import List from '@/components/list';
import Link from "next/link";
import {BiCategory, BiHome} from "react-icons/bi";
import {getItems} from "@/api/items";
import {getCuts} from "@/api/cuts";
import {getTechniques} from "@/api/techniques";
import {getAuthors} from "@/api/authors";
import {getMaterials} from "@/api/materials";
import {getRegions} from "@/api/regions";
import Collection from "@/components/collection";
import {Suspense} from "react";

type Props = {
    params: Promise<{ searchTerm: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(_: Props) {
    const [categories, cuts, techniques, authors, materials, regions] = await Promise.all([getCategories(), getCuts(), getTechniques(), getAuthors(), getMaterials(), getRegions()]);
    const {items} = await getItems();

    const collections = categories.filter(category => category.isCollection);

    return (
        <VStack align="stretch" gap={8}>
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    <Breadcrumb.Item>
                        <Breadcrumb.Link asChild>
                            <Link href="/">
                                <BiHome /> <Box hideBelow="lg">Головна</Box>
                            </Link>
                        </Breadcrumb.Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Separator />
                    <Breadcrumb.Item>
                        <Breadcrumb.CurrentLink>
                            <HStack>
                                <BiCategory /> Каталог
                            </HStack>
                        </Breadcrumb.CurrentLink>
                    </Breadcrumb.Item>
                </Breadcrumb.List>
            </Breadcrumb.Root>
            <VStack align="stretch">
                <Grid templateColumns="300px auto" gap={8}>
                    <Grid templateColumns="subgrid" gridColumn={`span 2`}>
                        <Suspense fallback={null}>
                            <List items={items} categories={categories} cuts={cuts} authors={authors} materials={materials} techniques={techniques} regions={regions} />
                        </Suspense>
                    </Grid>
                    <GridItem colStart={2}>
                        <VStack align="stretch" gap={8}>
                            <Heading fontSize={{ base: 'xl', xl: '3xl' }} fontWeight="light">
                                Дослідіть наші колекції:
                            </Heading>
                            <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                                {collections.map((item) => <Collection collection={item} key={item.id} />)}
                            </Grid>
                        </VStack>
                    </GridItem>
                </Grid>
            </VStack>
        </VStack>
    )
}