'use client'
import {FC} from "react";
import {DataList, HStack, Link as ChakraLink, Box} from "@chakra-ui/react";
import Link from "next/link";
import BrandButton from "@/components/brand/button";

type AttributesProps = {
    attributes: { name: string; collection: {
        name?: string;
        link: string;
        active: boolean
    }[] }[]
};

const Attributes: FC<AttributesProps> = ({ attributes }) => {
    return <Box className="px-4 pb-4">
        <DataList.Root orientation="horizontal" divideY="1px">
            {attributes.map((item) => (
                <DataList.Item key={item.name} pt="4">
                    <DataList.ItemLabel>{item.name}</DataList.ItemLabel>
                    <DataList.ItemValue>
                        <HStack wrap="wrap">
                            {item.collection.map(entry => (
                                <BrandButton key={entry.name} size="xs" asChild {...entry.active ? {
                                    variant: 'brand-primary'
                                } : {
                                    colorPalette: 'gray',
                                    variant: 'subtle'
                                }}>
                                    <ChakraLink asChild>
                                        <Link href={entry.link}>{entry.name}</Link>
                                    </ChakraLink>
                                </BrandButton>
                            ))}
                        </HStack>
                    </DataList.ItemValue>
                </DataList.Item>
            ))}
        </DataList.Root>
    </Box>
}

export default Attributes;