'use client';
import {FC, forwardRef} from "react";
import {Carousel as ChakraCarousel, HStack, useCarouselContext, Box, AspectRatio, IconButton, IconButtonProps} from "@chakra-ui/react";
import {Item} from "@/models/item";
import {BiLeftArrowAlt, BiRightArrowAlt} from "react-icons/bi";
import Image from "next/image";

const CarouselThumbnails = ({ items }: { items: string[] }) => {
    const carousel = useCarouselContext()

    return (
        <HStack justify="center">
            <ChakraCarousel.PrevTrigger asChild>
                <ActionButton>
                    <BiLeftArrowAlt />
                </ActionButton>
            </ChakraCarousel.PrevTrigger>
            {items.map((src, index) => (
                <AspectRatio
                    key={index}
                    ratio={1}
                    w="16"
                    cursor="button"
                    onClick={() => carousel.scrollTo(index)}
                >
                    <Image src={`https://storage.googleapis.com/spadok-images/${src}`} className="object-scale-down" alt="asd" fill />
                </AspectRatio>
            ))}
            <ChakraCarousel.NextTrigger asChild>
                <ActionButton>
                    <BiRightArrowAlt />
                </ActionButton>
            </ChakraCarousel.NextTrigger>
        </HStack>
    )
}

const ActionButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    function ActionButton(props, ref) {
        return (
            <IconButton
                {...props}
                ref={ref}
                size="xs"
                variant="solid"
                colorPalette="white"
            />
        )
    },
)

type CarouselProps = {
    item: Item
}

const Carousel: FC<CarouselProps> = ({ item }) => {
    return <ChakraCarousel.Root
        slideCount={item.images.length}
        className="bg-gray-800 p-4"
        flex={1}
    >
        <ChakraCarousel.Control gap="4">
            <ChakraCarousel.ItemGroup width="full">
                {item.images.map((image, index) => (
                    <ChakraCarousel.Item key={index} index={index}>
                        <Box w="100%" rounded="lg" fontSize="2.5rem" className="relative h-[calc(100dvh-16rem)]">
                            <Image src={`https://storage.googleapis.com/spadok-images/${image}`} className="object-scale-down" alt={item.name} fill />
                        </Box>
                    </ChakraCarousel.Item>
                ))}
            </ChakraCarousel.ItemGroup>

            {/*<ChakraCarousel.NextTrigger asChild>*/}
            {/*    <ActionButton insetEnd="4">*/}
            {/*        <BiRightArrowAlt />*/}
            {/*    </ActionButton>*/}
            {/*</ChakraCarousel.NextTrigger>*/}
        </ChakraCarousel.Control>
        <CarouselThumbnails items={item.images} />
    </ChakraCarousel.Root>
}

export default Carousel;