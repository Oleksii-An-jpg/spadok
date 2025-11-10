'use client';
import {Provider} from "@/components/ui/provider";
import Header from "@/components/header";
import system from "@/theme";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return <Provider system={system}>
        <Header />
        {children}
    </Provider>;
}
