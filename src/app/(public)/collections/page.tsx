'use server';

import {Grid, Heading, VStack} from "@chakra-ui/react";
import {getCategories} from "@/api/categories";
import Collection from "@/components/collection";

export default async function Page() {
    const categories = await getCategories();
    return <VStack align="stretch" gap={8}>
        <Heading size={{ base: '2xl', xl: '4xl' }} fontWeight="light">Наші колекції</Heading>
        <Grid templateColumns={{ base: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap={4}>
            {categories.filter(category => category.isCollection).map(category => (
                <Collection collection={category} key={category.id} />
            ))}
        </Grid>
    </VStack>
}
