'use client';
import {Provider} from "@/components/ui/provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import system from "@/theme";
import {Box, Container} from "@chakra-ui/react";
import Script from "next/script";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return <Provider system={system} forcedTheme="light">
        <Box className="bg-white">
            <Header />
            <Container py={10} px="30px">
                {children}
            </Container>
            <Footer />
        </Box>
        <Script
            id="show-banner-script-2"
            dangerouslySetInnerHTML={{
                __html: `!function (t, e, c, n) {
            var s = e.createElement(c);
            s.async = 1, s.src = 'https://statics.esputnik.com/scripts/' + n + '.js';
            var r = e.scripts[0];
            r.parentNode.insertBefore(s, r);
            var f = function () {
            f.c(arguments);
        };
            f.q = [];
            f.c = function () {
            f.q.push(arguments);
        };
            t['eS'] = t['eS'] || f;
        }(window, document, 'script', 'B26AC75AE97C444F8CF2674E41F69C8E');`,
            }}
        />
        <Script id="show-banner-script-3" dangerouslySetInnerHTML={{
            __html: `eS('init');`,
        }} />
    </Provider>;
}
