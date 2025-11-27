'use server'
import {ReactNode} from "react";
import {Container} from "@chakra-ui/react";

export default async function CatalogLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return <Container py={8}>
        {children}
    </Container>
}