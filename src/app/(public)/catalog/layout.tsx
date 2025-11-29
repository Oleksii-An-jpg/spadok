'use server'
import {ReactNode} from "react";

export default async function CatalogLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return children
}