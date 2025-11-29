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
                    <VStack className="[clip-path:polygon(0_20px,20px_20px,20px_0,calc(100%-20px)_0,calc(100%-20px)_20px,100%_20px,100%_calc(100%-20px),calc(100%-20px)_calc(100%-20px),calc(100%-20px)_100%,20px_100%,20px_calc(100%-20px),0_calc(100%-20px))] lg:[clip-path:polygon(0_30px,30px_30px,30px_0,calc(100%-30px)_0,calc(100%-30px)_30px,100%_30px,100%_calc(100%-30px),calc(100%-30px)_calc(100%-30px),calc(100%-30px)_100%,30px_100%,30px_calc(100%-30px),0_calc(100%-30px))]
">
                        <img src={`https://storage.googleapis.com/spadok-images/${collection.highlight}`} alt={collection.name} />
                    </VStack>
                </Link>
            </ChakraLink>
        </LinkOverlay>
    </LinkBox>
};

export default Collection;