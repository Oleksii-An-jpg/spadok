'use client';
import {FC, forwardRef, useRef, useState} from "react";
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
                colorPalette="red"
            />
        )
    },
)

type CarouselProps = {
    images: string[];
    alt: string;
    thumbnails?: boolean;
    fullSize?: boolean;
}

const Carousel: FC<CarouselProps> = ({ images, alt, fullSize = true, thumbnails = true }) => {
    const [horizontalPage, setHorizontalPage] = useState(0);
    const [verticalPage, setVerticalPage] = useState(0);
    const verticalNextRef = useRef<HTMLButtonElement>(null);
    const verticalPrevRef = useRef<HTMLButtonElement>(null);
    const horizontalNextRef = useRef<HTMLButtonElement>(null);
    const horizontalPrevRef = useRef<HTMLButtonElement>(null);
    const lastVerticalPageRef = useRef(0);

    const handleThumbnailClick = (index: number) => {
        const direction = index > horizontalPage ? 'next' : 'prev';

        const button = direction === 'next' ? horizontalNextRef.current : horizontalPrevRef.current;

        if (button) {
            button.click();
        }

        setHorizontalPage(index);
        lastVerticalPageRef.current = Math.floor(index / 2);
    };

    const handleHorizontalPageChange = (e: { page: number }) => {
        setHorizontalPage(e.page);
        const newVerticalPage = Math.floor(e.page / 2);

        // Trigger button clicks to animate the vertical carousel
        if (newVerticalPage !== lastVerticalPageRef.current) {
            const direction = newVerticalPage > lastVerticalPageRef.current ? 'next' : 'prev';
            const button = direction === 'next' ? verticalNextRef.current : verticalPrevRef.current;

            if (button) {
                button.click();
            }

            lastVerticalPageRef.current = newVerticalPage;
        }
    };

    return <Grid as={GridItem} templateColumns="subgrid" gridColumn="1 / -1">
        <GridItem>
            <Box className="h-full" display={{ base: 'none', xl: 'block' }}>
                {thumbnails && (
                    <ChakraCarousel.Root
                        slideCount={images.length}
                        allowMouseDrag={false}
                        slidesPerPage={2}
                        flex={1}
                        spacing="8px"
                        asChild
                        orientation="vertical"
                        page={verticalPage}
                        onPageChange={(e) => setVerticalPage(e.page)}
                    >
                        <ChakraCarousel.Control gap="4" className="h-full">
                            <ChakraCarousel.ItemGroup width="full" className="h-full">
                                {images.map((image, index) => (
                                    <ChakraCarousel.Item key={index} index={index}>
                                        <Box w="100%" fontSize="2.5rem" className={clsx('border border-transparent relative h-full bg-concrete', {
                                            ['border-salmon!']: horizontalPage === index
                                        })} onClick={() => handleThumbnailClick(index)}>
                                            {fullSize ? <Image src={`https://storage.googleapis.com/spadok-images/${image}`} className="object-scale-down" alt={alt} fill /> : <img src={`https://storage.googleapis.com/spadok-images/${image}`} alt={alt} />}
                                        </Box>
                                    </ChakraCarousel.Item>
                                ))}
                            </ChakraCarousel.ItemGroup>
                            {/* Hidden control buttons for programmatic triggering */}
                            <ChakraCarousel.PrevTrigger ref={verticalPrevRef} className="hidden" />
                            <ChakraCarousel.NextTrigger ref={verticalNextRef} className="hidden" />
                        </ChakraCarousel.Control>
                    </ChakraCarousel.Root>
                )}
            </Box>
        </GridItem>
        <GridItem className="relative">
            <ChakraCarousel.Root
                slideCount={images.length}
                flex={1}
                gap={4}
                page={horizontalPage}
                onPageChange={handleHorizontalPageChange}
            >
                <ChakraCarousel.Control gap="4" className="h-full">
                    <ChakraCarousel.ItemGroup width="full" className="bg-concrete h-full">
                        <Box className="absolute bottom-0 left-0 z-1">
                            <ChakraCarousel.PrevTrigger ref={horizontalPrevRef} asChild>
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
                        <Box className="absolute bottom-0 right-0">
                            <ChakraCarousel.NextTrigger ref={horizontalNextRef} asChild>
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