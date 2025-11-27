import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";

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
        {
            path: './e-Ukraine-Bold.otf',
            weight: '700',
            style: 'bold',
        }
    ],
})

export const metadata: Metadata = {
    metadataBase: new URL('https://staging.spadok.foundation'),
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
        className={`${eUkraine.variable} bg-white subpixel-antialiased`}
      >
      {children}
      </body>
    </html>
  );
}
