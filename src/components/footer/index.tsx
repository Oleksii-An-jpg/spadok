'use client';
import {FC} from "react";
import Link from "next/link";
import Section from "@/components/section";

const Footer: FC = () => {
    return <Section className='py-6 xl:py-16 relative after:content-[""] after:absolute after:right-0 after:bottom-full after:w-[30px] after:h-[30px] after:bg-concrete after:border after:border-gray-200 after:border-b-0 after:border-r-0 before:content-[""] before:absolute before:left-0 before:bottom-full before:w-[30px] before:h-[30px] before:bg-concrete before:border before:border-gray-200 before:border-b-0 before:border-l-0' variant="quinary" inset={true}>
        <footer className="flex flex-wrap justify-between gap-y-10 gap-x-10 text-xs">
            <div>
                <h4 className="text-sm xl:text-2xl mb-3.5 xl:mb-5">
                    Спільний спадок
                </h4>
                <ul className="text-gray-600">
                    <li className="mb-1 xl:mb-2.5">
                        <Link
                            href="mailto:welcome@spadok.foundation"
                            className="underline"
                        >
                            welcome@spadok.foundation
                        </Link>
                    </li>
                    <li className="mb-1 xl:mb-2.5">
                        <Link
                            href="https://www.facebook.com/spilnyi.spadok"
                            className="underline"
                            target="_blank"
                        >
                            facebook
                        </Link>
                    </li>
                    <li className="mb-1 xl:mb-2.5">
                        <Link
                            href="https://instagram.com/spilnyi.spadok"
                            className="underline"
                            target="_blank"
                        >
                            instagram
                        </Link>
                    </li>
                </ul>
            </div>
            <div>
                <h4 className="text-sm xl:text-2xl mb-3.5 xl:mb-5">
                    Музей Івана Гончара
                </h4>
                <ul className="text-gray-600">
                    <li className="mb-1 xl:mb-2.5">
                        <Link
                            href="https://honchar.org.ua"
                            className="underline"
                            target="_blank"
                        >
                            honchar.org.ua
                        </Link>
                    </li>
                    <li className="mb-1 xl:mb-2.5">
                        <Link
                            href="https://facebook.com/honcharmuseum"
                            className="underline"
                            target="_blank"
                        >
                            facebook
                        </Link>
                    </li>
                    <li className="mb-1 xl:mb-2.5">
                        <Link
                            href="https://instagram.com/honchar.museum"
                            className="underline"
                            target="_blank"
                        >
                            instagram
                        </Link>
                    </li>
                </ul>
            </div>
            <div>
                <h4 className="text-sm xl:text-2xl mb-3.5 xl:mb-5">
                    Благодійний фонд «КОЛО»
                </h4>
                <ul className="text-gray-600">
                    <li className="mb-1 xl:mb-2.5">
                        <Link
                            href="https://www.kolo.fund"
                            className="underline"
                            target="_blank"
                        >
                            kolo.fund
                        </Link>
                    </li>
                    <li className="mb-1 xl:mb-2.5">
                        <Link
                            href="https://www.facebook.com/kolofund"
                            className="underline"
                            target="_blank"
                        >
                            facebook
                        </Link>
                    </li>
                    <li className="mb-1 xl:mb-2.5">
                        <Link
                            href="https://www.instagram.com/kolo_fund"
                            className="underline"
                            target="_blank"
                        >
                            instagram
                        </Link>
                    </li>
                </ul>
            </div>
            <p className="min-w-full">
                Спільний спадок © {new Date().getFullYear()}
            </p>
        </footer>
    </Section>
}

export default Footer;