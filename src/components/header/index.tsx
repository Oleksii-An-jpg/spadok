'use client';
import {FC, HTMLAttributes} from "react";
import clsx from "clsx";
import Link from "next/link";
import {Logo} from "@/components/logo";
import BrandButton from "@/components/brand/button";
import {HStack, IconButton, Link as ChakraLink} from "@chakra-ui/react";
import {BiLogoInstagram} from "react-icons/bi";

const Header: FC<HTMLAttributes<HTMLHeadingElement>> = ({
                                                            className,
                                                            ...rest
                                                        }) => {
    return (
        <header
            className={clsx(
                'sticky z-10 top-0 py-3 xl:py-5 px-5 xl:px-32 bg-concrete border-b border-gray-200',
                'before:content-[""] before:absolute before:left-0 before:top-full before:w-[30px] before:h-[30px] before:bg-concrete before:border before:border-gray-200 before:border-t-0 before:border-l-0',
                'after:content-[""] after:absolute after:right-0 after:top-full after:w-[30px] after:h-[30px] after:bg-concrete after:border after:border-gray-200 after:border-t-0 after:border-r-0',
                className
            )}
            {...rest}
        >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <Link href="/">
                    <Logo />
                </Link>
                <HStack>
                    <IconButton size={{ base: 'sm', md: 'xl' }} asChild variant="solid" colorPalette="yellow" bg="khaki">
                        <ChakraLink asChild>
                            <Link href="https://instagram.com/spilnyi.spadok"
                                  className="underline"
                                  target="_blank">
                                <BiLogoInstagram className="w-6! h-6! xl:w-9! xl:h-9!" />
                            </Link>
                        </ChakraLink>
                    </IconButton>
                    <Link href="https://www.patreon.com/spilnyi_spadok" target="_blank">
                        <BrandButton variant="brand-primary" size={{ base: 'sm', md: 'xl' }}>
                            Доєднатися
                        </BrandButton>
                    </Link>
                </HStack>
            </div>
        </header>
    );
};

export default Header;