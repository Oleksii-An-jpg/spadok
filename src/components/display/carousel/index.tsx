'use client';
import {FC, forwardRef} from "react";
import {Box, Carousel as ChakraCarousel, Grid, GridItem, IconButton, IconButtonProps} from "@chakra-ui/react";
import Image from "next/image";
import {BiLeftArrowAlt, BiRightArrowAlt} from "react-icons/bi";
import clsx from "clsx";

const ActionButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    function ActionButton(props, ref) {
        return (
            <IconButton
                {...props}
                ref={ref}
                size="lg"
                variant="solid"
                colorPalette="salmon"
            />
        )
    },
)

type CarouselProps = {
    images: string[];
    alt: string;
    fullSize?: boolean;
}

const Carousel: FC<CarouselProps> = ({ images, alt, fullSize = true }) => {
    return <Grid as={GridItem} templateColumns="subgrid" gridColumn="1 / -1">
        <GridItem>
            <Box className="h-full" display={{ base: 'none', xl: 'block' }}>
                {/*{thumbnails && (*/}
                {/*    <ChakraCarousel.Root*/}
                {/*        slideCount={images.length}*/}
                {/*        allowMouseDrag={false}*/}
                {/*        slidesPerPage={2}*/}
                {/*        flex={1}*/}
                {/*        spacing="8px"*/}
                {/*        asChild*/}
                {/*        orientation="vertical"*/}
                {/*        page={verticalPage}*/}
                {/*        onPageChange={(e) => setVerticalPage(e.page)}*/}
                {/*    >*/}
                {/*        <ChakraCarousel.Control gap="4" className="h-full">*/}
                {/*            <ChakraCarousel.ItemGroup width="full" className="h-full">*/}
                {/*                {images.map((image, index) => (*/}
                {/*                    <ChakraCarousel.Item key={index} index={index}>*/}
                {/*                        <Box w="100%" fontSize="2.5rem" className={clsx('border border-transparent relative h-full bg-concrete', {*/}
                {/*                            ['border-salmon!']: horizontalPage === index*/}
                {/*                        })} onClick={() => handleThumbnailClick(index)}>*/}
                {/*                            {fullSize ? <Image src={`https://storage.googleapis.com/spadok-images/${image}`} className="object-cover" alt={alt} fill /> : <img src={`https://storage.googleapis.com/spadok-images/${image}`} alt={alt} />}*/}
                {/*                        </Box>*/}
                {/*                    </ChakraCarousel.Item>*/}
                {/*                ))}*/}
                {/*            </ChakraCarousel.ItemGroup>*/}
                {/*            /!* Hidden control buttons for programmatic triggering *!/*/}
                {/*            <ChakraCarousel.PrevTrigger ref={verticalPrevRef} className="hidden" />*/}
                {/*            <ChakraCarousel.NextTrigger ref={verticalNextRef} className="hidden" />*/}
                {/*        </ChakraCarousel.Control>*/}
                {/*    </ChakraCarousel.Root>*/}
                {/*)}*/}
            </Box>
        </GridItem>
        <GridItem className="relative">
            <ChakraCarousel.Root
                slideCount={images.length}
                flex={1}
                gap={4}
            >
                <ChakraCarousel.Control gap="4" className="h-full">
                    <ChakraCarousel.ItemGroup width="full" className="xl:bg-concrete h-full">
                        <Box className="absolute bottom-1/2 translate-y-1/2 xl:translate-0 xl:bottom-0 left-0 z-1">
                            <ChakraCarousel.PrevTrigger asChild>
                                <ActionButton>
                                    <BiLeftArrowAlt className="w-9! h-9!" color="black" />
                                </ActionButton>
                            </ChakraCarousel.PrevTrigger>
                        </Box>
                        {images.map((image, index) => (
                            <ChakraCarousel.Item key={index} index={index}>
                                <Box w="100%" rounded="lg" fontSize="2.5rem" className={clsx({
                                    ["relative h-full min-h-[calc(100dvh-18rem)]"]: fullSize
                                })}>
                                    {fullSize ? <Image src={`https://storage.googleapis.com/spadok-images/${image}`} className="object-scale-down" alt={alt} fill /> : <img src={`https://storage.googleapis.com/spadok-images/${image}`} alt={alt} />}
                                </Box>
                            </ChakraCarousel.Item>
                        ))}
                        <Box className="absolute bottom-1/2 translate-y-1/2 xl:translate-0 xl:bottom-0 right-0">
                            <ChakraCarousel.NextTrigger asChild>
                                <ActionButton>
                                    <BiRightArrowAlt className="w-9! h-9!" color="black" />
                                </ActionButton>
                            </ChakraCarousel.NextTrigger>
                        </Box>
                    </ChakraCarousel.ItemGroup>
                </ChakraCarousel.Control>
            </ChakraCarousel.Root>
        </GridItem>
    </Grid>
}

export default Carousel;