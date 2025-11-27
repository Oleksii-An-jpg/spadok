'use client';
import {FC} from "react";
import Link from "next/link";
import BrandButton from "@/components/brand/button";
import {Box} from "@chakra-ui/react";

const Banner: FC = () => {
    return <Box className="py-24 xl:py-48 text-center [clip-path:polygon(0_20px,20px_20px,20px_0,calc(100%-20px)_0,calc(100%-20px)_20px,100%_20px,100%_calc(100%-20px),calc(100%-20px)_calc(100%-20px),calc(100%-20px)_100%,20px_100%,20px_calc(100%-20px),0_calc(100%-20px))] bg-khaki">
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