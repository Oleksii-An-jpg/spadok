'use client';
import {FC} from "react";
import {LinkBox, LinkOverlay, VStack, Link as ChakraLink} from "@chakra-ui/react";
import Link from "next/link";
import {Category} from "@/models/category";

type CollectionProps = {
    collection: Category;
}

const Collection: FC<CollectionProps> = ({ collection }) => {
    return <LinkBox className="break-inside-avoid">
        <LinkOverlay asChild>
            <ChakraLink asChild>
                <Link href={`/collections/${collection.id}`}>
                    <VStack className="[clip-path:polygon(0_34px,34px_34px,34px_0,calc(100%-34px)_0,calc(100%-34px)_34px,100%_34px,100%_calc(100%-34px),calc(100%-34px)_calc(100%-34px),calc(100%-34px)_100%,34px_100%,34px_calc(100%-34px),0_calc(100%-34px))]
">
                        <img src={`https://storage.googleapis.com/spadok-images/${collection.highlight}`} alt={collection.name} />
                    </VStack>
                </Link>
            </ChakraLink>
        </LinkOverlay>
    </LinkBox>
};

export default Collection;