import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import {Provider} from "@/components/ui/provider";

const eUkraine = localFont({
    variable: '--font-e-ukraine',
    src: [
        {
            path: './e-Ukraine-Light.otf',
            weight: '300',
            style: 'normal',
        },
        {
            path: './e-Ukraine-UltraLight.otf',
            weight: '200',
            style: 'normal',
        },
    ],
})

export const metadata: Metadata = {
  title: "Краудфандинг «Спільний спадок». Спільно купуємо речі для музеїв.",
    description: "Шукаємо старовинні українські речі у вільному продажу й спільно викуповуємо найцінніші з них для музеїв. Оформлюйте передплату й ставайте меценатами «Спільного спадку».",
    openGraph: {
        title: "Краудфандинг «Спільний спадок». Спільно купуємо речі для музеїв.",
        description: "Шукаємо старовинні українські речі у вільному продажу й спільно викуповуємо найцінніші з них для музеїв. Оформлюйте передплату й ставайте меценатами «Спільного спадку».",
        images: '/cover.png',
    },
    twitter: {
        card: 'summary_large_image',
        images: '/cover.png',
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${eUkraine.variable} subpixel-antialiased`}
      >
      <Provider>
          {children}
      </Provider>
      </body>
    </html>
  );
}
