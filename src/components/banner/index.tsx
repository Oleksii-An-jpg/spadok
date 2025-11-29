'use client';
import {FC} from "react";
import Link from "next/link";
import BrandButton from "@/components/brand/button";
import {Box} from "@chakra-ui/react";

const Banner: FC = () => {
    return <Box className="px-5 xl:px-32 py-24 xl:py-48 text-center [clip-path:polygon(0_30px,30px_30px,30px_0,calc(100%-30px)_0,calc(100%-30px)_30px,100%_30px,100%_calc(100%-30px),calc(100%-30px)_calc(100%-30px),calc(100%-30px)_100%,30px_100%,30px_calc(100%-30px),0_calc(100%-30px))] bg-khaki">
        <h2 className="max-w-4xl mx-auto text-2xl xl:text-4xl mb-8 xl:mb-16 font-light">
            Досліджувати й розвивати нашу спільну спадщину — велика любов. Разом
            ми можемо робити маленькі справи, аби поширювати цю любов країною.
        </h2>
        <Link
            className="inline-block p-5"
            href="https://www.patreon.com/spilnyi_spadok"
            target="_blank"
        >
            <BrandButton decorated size="xl" variant="brand-secondary">
                Доєднатися
            </BrandButton>
        </Link>
    </Box>
}

export default Banner;