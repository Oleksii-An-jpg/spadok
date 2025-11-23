'use server';

import {getCategories} from "@/api/categories";
import {
    Box,
    Card,
    LinkOverlay,
    Text,
    VStack,
    Link as ChakraLink,
    Breadcrumb,
    HStack,
    Grid,
    Heading
} from "@chakra-ui/react";
import List from '@/components/list';
import Link from "next/link";
import {BiCategory, BiHome} from "react-icons/bi";
import {getItems} from "@/api/items";
import Facets from "@/components/facets";
import {getCuts} from "@/api/cuts";
import {getTechniques} from "@/api/techniques";
import {getAuthors} from "@/api/authors";
import {getMaterials} from "@/api/materials";
import {getRegions} from "@/api/regions";

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
                                <BiHome /> Головна
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
            <Grid templateColumns="300px auto" gap={4}>
                <Facets categories={categories} cuts={cuts} authors={authors} materials={materials} techniques={techniques} regions={regions} />
                <VStack align="stretch">
                    <List items={items} />
                    <Heading>Наші підбірки</Heading>
                    <Box columnCount={{ base: 3, md: 4, lg: 5, xl: 6 }} gap={4}>
                        {collections.map((category) => {
                            return (
                                <Card.Root variant="elevated" size="sm" key={category.id} className="break-inside-avoid mb-4">
                                    <Card.Body>
                                        <LinkOverlay asChild>
                                            <ChakraLink asChild variant="plain">
                                                <Link prefetch={false} href={`/collections/${category.id}`}>
                                                    <VStack>
                                                        <img src={`https://storage.googleapis.com/spadok-images/${category.highlight}`} alt={category.name} />
                                                        <VStack gap={0.5}>
                                                            <Text fontSize="sm" className="text-center">{category.name}</Text>
                                                        </VStack>
                                                    </VStack>
                                                </Link>
                                            </ChakraLink>
                                        </LinkOverlay>
                                    </Card.Body>
                                </Card.Root>
                            )
                        })}
                    </Box>
                </VStack>
            </Grid>
        </VStack>
    )
}