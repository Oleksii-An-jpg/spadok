'use server'
import {ReactNode} from "react";
import {Grid, GridItem, Button, VStack} from "@chakra-ui/react";
import {getCategories} from "@/api/categories";
import Link from "next/link";
import {getItems} from "@/api/items";

export default async function CatalogLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    const categories = await getCategories();
    const {items} = await getItems();
    const withItems = categories.map(category => ({
        ...category,
        items: items.filter(item => item.mainCategory === category.id || item.subCategories?.includes(category.id)).map(item => ({
            id: item.id,
            highlight: item.images[0],
            name: item.name
        })),
    })).filter(category => category.items.length > 3);
    return <Grid templateColumns="repeat(5, 1fr)">
        <GridItem>
            <VStack align="stretch" gap={2}>
                {withItems.map(category => (
                    <Button key={category.id} asChild colorPalette="blue" variant="subtle">
                        <Link prefetch={false} href={`/src/app/(public)/collections/${category.id}`}>
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