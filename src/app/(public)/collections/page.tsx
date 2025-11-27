'use server';

import {Box, Heading, VStack} from "@chakra-ui/react";
import {getCategories} from "@/api/categories";
import Collection from "@/components/collection";

export default async function Page() {
    const categories = await getCategories();
    return <VStack align="stretch" gap={4}>
        <Heading size={{ base: '2xl', xl: '4xl' }} fontWeight="light">Наші колекції</Heading>
        <Box columnCount={{ base: 3, md: 4, lg: 5, xl: 6 }} gap={4}>
            {categories.filter(category => category.isCollection).map(category => (
                <Collection collection={category} key={category.id} />
            ))}
        </Box>
    </VStack>
}
