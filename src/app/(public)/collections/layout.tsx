'use server'
import {ReactNode} from "react";

export default async function CollectionsLayout({
                                       children,
                                   }: Readonly<{
    children: ReactNode;
}>) {
    return children
}