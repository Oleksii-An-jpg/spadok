'use client'
import {FC} from "react";
import {DataList, HStack, Link as ChakraLink, Box, Button, Text} from "@chakra-ui/react";
import Link from "next/link";

type AttributesProps = {
    attributes: { name: string; collection: {
        name?: string;
        link?: string;
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
                            {item.collection.filter(entry => entry.link).map(entry => (
                                // TODO(@oleksii.a): perhaps show collection as a special link
                                <Button disabled={!entry.link} key={entry.name} size="xs" asChild variant="subtle" colorPalette="gray">
                                    {entry.link ? (
                                        <ChakraLink asChild>
                                            <Link href={entry.link}>{entry.name}</Link>
                                        </ChakraLink>
                                    ) : <Text>{entry.name}</Text>}
                                </Button>
                            ))}
                        </HStack>
                    </DataList.ItemValue>
                </DataList.Item>
            ))}
        </DataList.Root>
    </Box>
}

export default Attributes;