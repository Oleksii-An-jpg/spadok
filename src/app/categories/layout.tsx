'use server'
import {ReactNode} from "react";
import {Grid, GridItem, Button, VStack} from "@chakra-ui/react";
import {getCategories} from "@/api/categories";
import Link from "next/link";

export default async function CatalogLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    const categories = await getCategories();
    return <Grid templateColumns="repeat(5, 1fr)" className="xl:text-sm">
        <GridItem>
            <VStack align="stretch" gap={2}>
                {categories.map(category => (
                    <Button key={category.id} asChild colorPalette="blue" variant="subtle">
                        <Link prefetch={false} href={`/categories/${category.id}`}>
                            {category.name}
                        </Link>
                    </Button>
                ))}
            </VStack>
        </GridItem>
        <GridItem colSpan={4}>
            {children}
        </GridItem>
    </Grid>
}