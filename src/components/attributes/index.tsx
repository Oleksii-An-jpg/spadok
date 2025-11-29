'use client'
import {FC} from "react";
import {DataList, HStack, Tag, Box} from "@chakra-ui/react";
import Link from "next/link";

type AttributesProps = {
    attributes: { name: string; collection: {
        name?: string;
        link: string;
    }[] }[]
};

const Attributes: FC<AttributesProps> = ({ attributes }) => {
    return <Box className="bg-concrete px-4 pb-4">
        <DataList.Root className="bg-concrete" orientation="horizontal" divideY="1px">
            {attributes.map((item) => (
                <DataList.Item key={item.name} pt="4">
                    <DataList.ItemLabel>{item.name}</DataList.ItemLabel>
                    <DataList.ItemValue>
                        <HStack>
                            {item.collection.map(entry => (
                                <Tag.Root variant="solid" key={entry.name}>
                                    <Tag.Label>
                                        <Link href={entry.link}>
                                            {entry.name}
                                        </Link>
                                    </Tag.Label>
                                </Tag.Root>
                            ))}
                        </HStack>
                    </DataList.ItemValue>
                </DataList.Item>
            ))}
        </DataList.Root>
    </Box>
}

export default Attributes;