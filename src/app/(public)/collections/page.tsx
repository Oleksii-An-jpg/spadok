'use server';

import {Box, Breadcrumb, Grid, Heading, HStack, VStack} from "@chakra-ui/react";
import {getCategories} from "@/api/categories";
import Collection from "@/components/collection";
import Link from "next/link";
import {BiCategory, BiHome} from "react-icons/bi";

export default async function Page() {
    const categories = await getCategories();
    return <VStack align="stretch" gap={8}>
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
                            <BiCategory /> Колекції
                        </HStack>
                    </Breadcrumb.CurrentLink>
                </Breadcrumb.Item>
            </Breadcrumb.List>
        </Breadcrumb.Root>
        <Heading size={{ base: '2xl', xl: '4xl' }} fontWeight="light">Наші колекції</Heading>
        <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
            {categories.filter(category => category.isCollection).map(category => (
                <Collection collection={category} key={category.id} />
            ))}
        </Grid>
    </VStack>
}
