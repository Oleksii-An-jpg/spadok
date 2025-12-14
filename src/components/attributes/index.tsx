'use client'
import {FC, Fragment} from "react";
import { HStack, Link as ChakraLink, Text} from "@chakra-ui/react";
import Link from "next/link";
import BrandButton from "@/components/brand/button";

type AttributesProps = {
    attributes: { name: string; collection: {
        name?: string;
        link?: string;
    }[] }[]
};

const Attributes: FC<AttributesProps> = ({ attributes }) => {
    return <HStack wrap="wrap">
        {attributes.map(attribute => {
            return <Fragment key={attribute.name}>
                {attribute.collection.filter(entry => entry.link).map((entry) => (
                    <BrandButton disabled={!entry.link} key={entry.name} size="sm" asChild variant="brand-quaternary">
                        {entry.link ? (
                            <ChakraLink asChild>
                                <Link prefetch={false} href={entry.link}>{entry.name}</Link>
                            </ChakraLink>
                        ) : <Text>{entry.name}</Text>}
                    </BrandButton>
                ))}
            </Fragment>
        })}
    </HStack>;

    // return <Box className="px-4 pb-4">
    //
    //     <DataList.Root orientation="horizontal" divideY="1px">
    //         {attributes.map((item) => (
    //             <DataList.Item key={item.name} pt="4">
    //                 <DataList.ItemLabel>{item.name}</DataList.ItemLabel>
    //                 <DataList.ItemValue>
    //                     <HStack wrap="wrap">
    //                         {item.collection.filter(entry => entry.link).map(entry => (
    //                             // TODO(@oleksii.a): perhaps show collection as a special link
    //                             <Button disabled={!entry.link} key={entry.name} size="xs" asChild variant="subtle" colorPalette="gray">
    //                                 {entry.link ? (
    //                                     <ChakraLink asChild>
    //                                         <Link href={entry.link}>{entry.name}</Link>
    //                                     </ChakraLink>
    //                                 ) : <Text>{entry.name}</Text>}
    //                             </Button>
    //                         ))}
    //                     </HStack>
    //                 </DataList.ItemValue>
    //             </DataList.Item>
    //         ))}
    //     </DataList.Root>
    // </Box>
}

export default Attributes;