'use client';

import {Box, Grid, GridItem, Heading, Link as ChakraLink} from "@chakra-ui/react";
import Markdown from "react-markdown";
import ChakraMarkdownComponents from "@/components/markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import {Region} from "@/models/region";
import {Category} from "@/models/category";
import {FC} from "react";
import {useBoolean} from "usehooks-ts";

type DescriptionProps = {
    entity: Region | Category
}

const Description: FC<DescriptionProps> = ({ entity }) => {
    const { value, toggle } = useBoolean(true)
    return <Grid gridTemplateColumns={{ xl: '1fr 2fr' }} gap={4}>
        <GridItem>
            <Heading fontSize={{ base: 'xl', xl: '3xl' }} fontWeight="light">
                {entity.name}
            </Heading>
        </GridItem>
        <GridItem>
            <Box {...value && {
                lineClamp: {
                    base: 3,
                    xl: 'none'
                }
            }}>
                <Markdown components={ChakraMarkdownComponents} rehypePlugins={[rehypeRaw, rehypeHighlight]}>{entity?.description}</Markdown>
            </Box>
            <ChakraLink className="xl:hidden!" onClick={toggle} fontSize="sm" color="gray.500" variant="underline">
                {value ? 'Повний опис' : 'Приховати'}
            </ChakraLink>
        </GridItem>
    </Grid>
}

export default Description;