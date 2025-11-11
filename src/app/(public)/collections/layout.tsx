'use server'
import {ReactNode} from "react";
import {Container, Grid, GridItem} from "@chakra-ui/react";
// import {getCategories} from "@/api/categories";
// import Link from "next/link";
// import {getItems} from "@/api/items";

export default async function CatalogLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    // const categories = await getCategories();
    // const {items} = await getItems();
    // const withItems = categories.map(category => ({
    //     ...category,
    //     items: items.filter(item => item.mainCategory === category.id || item.subCategories?.includes(category.id)).map(item => ({
    //         id: item.id,
    //         highlight: item.images[0],
    //         name: item.name
    //     })),
    // })).filter(category => category.items.length > 3);
    return <Container py={8}>
        {/*<Grid templateColumns="repeat(5, 1fr)" templateRows="masonry" gap={4}>*/}
        {/*</Grid>*/}
        {children}
    </Container>
}