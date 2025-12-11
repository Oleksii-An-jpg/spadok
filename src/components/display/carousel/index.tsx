'use client';
import {FC, forwardRef} from "react";
import {
    Carousel as ChakraCarousel,
    useCarouselContext,
    Box,
    AspectRatio,
    IconButton,
    IconButtonProps,
    Grid, GridItem, VStack
} from "@chakra-ui/react";
import {Item} from "@/models/item";
import Image from "next/image";

const CarouselThumbnails = ({ items }: { items: string[] }) => {
    const carousel = useCarouselContext()

    return (
        <VStack justify="center">
            {/*<ChakraCarousel.PrevTrigger asChild>*/}
            {/*    <ActionButton>*/}
            {/*        <BiLeftArrowAlt />*/}
            {/*    </ActionButton>*/}
            {/*</ChakraCarousel.PrevTrigger>*/}
            <VStack as={ChakraCarousel.IndicatorGroup}>
                {items.map((src, index) => (
                    <ChakraCarousel.Indicator index={index} key={index} unstyled
                                              _current={{
                                                  outline: "2px solid salmon",
                                                  outlineOffset: "2px",
                                              }}>
                        <AspectRatio
                            ratio={1}
                            w={{ base: 8, xl: 16 }}
                            cursor="button"
                            onClick={() => carousel.scrollTo(index)}
                        >
                            <Image src={`https://storage.googleapis.com/spadok-images/${src}`} className="object-scale-down" alt="Photo" fill />
                        </AspectRatio>
                    </ChakraCarousel.Indicator>
                ))}
            </VStack>
            {/*<ChakraCarousel.NextTrigger asChild>*/}
            {/*    <ActionButton>*/}
            {/*        <BiRightArrowAlt />*/}
            {/*    </ActionButton>*/}
            {/*</ChakraCarousel.NextTrigger>*/}
        </VStack>
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
        flex={1}
        gap={4}
        asChild
    >
        <Grid as={GridItem} templateColumns="subgrid" gridColumn="span 2">
            <GridItem>
                <CarouselThumbnails items={item.images} />
            </GridItem>
            <GridItem>
                <ChakraCarousel.Control gap="4">
                    <ChakraCarousel.ItemGroup width="full" className="bg-concrete">
                        {item.images.map((image, index) => (
                            <ChakraCarousel.Item key={index} index={index}>
                                <Box w="100%" rounded="lg" fontSize="2.5rem" className="relative h-[calc(100dvh-20rem)]">
                                    <Image src={`https://storage.googleapis.com/spadok-images/${image}`} className="object-scale-down" alt={item.name} fill />
                                </Box>
                            </ChakraCarousel.Item>
                        ))}
                    </ChakraCarousel.ItemGroup>
                </ChakraCarousel.Control>
            </GridItem>
        </Grid>
    </ChakraCarousel.Root>
}

export default Carousel;