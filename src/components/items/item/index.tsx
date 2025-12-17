'use client';
import {Item as ItemModel} from "@/models/item";
import {FC} from "react";
import {
    Card,
    LinkOverlay,
    Text,
    VStack,
    Link as ChakraLink,
    Box,
    Skeleton,
    Flex
} from "@chakra-ui/react";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import {useBoolean} from "usehooks-ts";
import {BiErrorAlt} from "react-icons/bi";

type ItemProps = {
    item: ItemModel;
    className?: string
}

const Item: FC<ItemProps> = ({ item, className }) => {
    const { value, setFalse } = useBoolean(true);
    const { value: error, setTrue } = useBoolean(false);
    return <Card.Root unstyled size="sm" key={item.id} className={clsx('break-inside-avoid relative pb-0.5', className)}>
        <Card.Body>
            <LinkOverlay asChild>
                <ChakraLink asChild variant="plain">
                    <Link prefetch={false} href={`/items/${item.id}`} className="w-full">
                        <VStack className={clsx('relative w-full', {
                            ['mb-1.5']: error
                        })} aspectRatio={`${item.imageDimensions[0].width} / ${item.imageDimensions[0].height}`}>
                            <Skeleton loading={value} className="relative w-full" aspectRatio={`${item.imageDimensions[0].width} / ${item.imageDimensions[0].height}`}>
                                {!error ? (
                                    <Image
                                        priority={false}
                                        src={`https://storage.googleapis.com/spadok-images/${item.images[0]}`}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        quality={50}
                                        onLoad={setFalse}
                                        onError={() => {
                                            setFalse();
                                            setTrue();
                                        }}
                                        style={{ objectFit: "cover" }}
                                    />
                                ) : (
                                    <Flex className="bg-gray-100 h-full items-center justify-around">
                                        <BiErrorAlt size={32} opacity={0.6} />
                                    </Flex>
                                )}
                            </Skeleton>
                            <VStack align="stretch" gap={0.5} className="absolute bottom-0 left-0 mr-2 xl:mr-6 text-start p-2 bg-khaki">
                                <Box fontSize={{ base: 'xx-small', xl: 'xs' }}>
                                    <Text fontWeight="bold">{item.name.trim()}</Text>
                                    {/* TODO(@oleksii.a): get rid of this */}
                                    {item.regions[0]?.name !== 'невідомо' && <Text as="span">{item.regions[0]?.name}</Text>}
                                </Box>
                            </VStack>
                        </VStack>
                    </Link>
                </ChakraLink>
            </LinkOverlay>
        </Card.Body>
    </Card.Root>
}

export default Item;