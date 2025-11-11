'use server';

import {getItems} from "@/api/items";
import {Box, Grid, GridItem} from "@chakra-ui/react";
import Image from "next/image";
import {getCategory} from "@/api/categories";

type Params = Promise<{ id: string }>

export default async function Page({params}: { params: Params }) {
    const {id} = await params;

    const category = await getCategory(id);
    const {items} = await getItems({
        category: id
    });

    return items.map((item) => (
            <GridItem key={item.id}>
                <Box className="relative h-96">
                    <Image src={`https://storage.googleapis.com/spadok-images/${item.images[0]}`} className="object-scale-down" alt={item.name} fill />
                </Box>
                {item.name}
            </GridItem>
        ))
}