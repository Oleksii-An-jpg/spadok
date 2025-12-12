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
import Image from "next/image";
import {BiLeftArrowAlt, BiRightArrowAlt} from "react-icons/bi";

const CarouselThumbnails = ({ images }: { images: string[] }) => {
    const carousel = useCarouselContext()

    return (
        <VStack justify="center">
            <VStack as={ChakraCarousel.IndicatorGroup}>
                {images.map((src, index) => (
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
        </VStack>
    )
}

const ActionButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    function ActionButton(props, ref) {
        return (
            <IconButton
                {...props}
                ref={ref}
                size="lg"
                variant="solid"
                colorPalette="red"
            />
        )
    },
)

type CarouselProps = {
    images: string[]
    thumbnails?: boolean;
}

const Carousel: FC<CarouselProps> = ({ images, thumbnails = true }) => {
    return <ChakraCarousel.Root
        slideCount={images.length}
        flex={1}
        gap={4}
        asChild
    >
        <Grid as={GridItem} templateColumns="subgrid" gridColumn="1 / -1">
            <GridItem>
                {thumbnails && <CarouselThumbnails images={images} />}
            </GridItem>
            <GridItem className="relative">
                <ChakraCarousel.Control gap="4" className="h-full">
                    <ChakraCarousel.ItemGroup width="full" className="bg-concrete h-full">
                        <Box className="absolute bottom-0 left-0 z-1">
                            <ChakraCarousel.PrevTrigger asChild>
                                <ActionButton>
                                    <BiLeftArrowAlt className="w-9! h-9!" color="black" />
                                </ActionButton>
                            </ChakraCarousel.PrevTrigger>
                        </Box>
                        {images.map((image, index) => (
                            <ChakraCarousel.Item key={index} index={index}>
                                <Box w="100%" rounded="lg" fontSize="2.5rem" className="relative h-full min-h-[calc(100dvh-18rem)]">
                                    <Image src={`https://storage.googleapis.com/spadok-images/${image}`} className="object-scale-down" alt="Фото" fill />
                                </Box>
                            </ChakraCarousel.Item>
                        ))}
                        <Box className="absolute bottom-0 right-0">
                            <ChakraCarousel.NextTrigger asChild>
                                <ActionButton>
                                    <BiRightArrowAlt className="w-9! h-9!" color="black" />
                                </ActionButton>
                            </ChakraCarousel.NextTrigger>
                        </Box>
                    </ChakraCarousel.ItemGroup>
                </ChakraCarousel.Control>
            </GridItem>
        </Grid>
    </ChakraCarousel.Root>
}

export default Carousel;