'use client';
import {FC, useMemo} from "react";
import {Button, VStack} from "@chakra-ui/react";
import {BiCategory, BiGlobe, BiHome, BiKnife, BiListUl, BiPaintRoll, BiCut, BiUser, BiGroup} from "react-icons/bi";
import Link from "next/link";
import {usePathname} from "next/navigation";

const Sidebar: FC = () => {
    const pathname = usePathname();
    const links = useMemo(() => [
        {name: 'Кошти', icon: BiHome, href: '/admin/founds'},
        {name: 'Предмети', icon: BiListUl, href: '/admin/items'},
        {name: 'Регіони', icon: BiGlobe, href: '/admin/regions'},
        {name: 'Техніки', icon: BiKnife, href: '/admin/techniques'},
        {name: 'Категорії', icon: BiCategory, href: '/admin/categories'},
        {name: 'Матеріали', icon: BiPaintRoll, href: '/admin/materials'},
        {name: 'Автори', icon: BiUser, href: '/admin/authors'},
        {name: 'Крої', icon: BiCut, href: '/admin/cuts'},
        {name: 'Команда', icon: BiGroup, href: '/admin/members'},
    ].map(link => ({
        ...link,
        active: pathname === link.href,
    })), [pathname]);
    return <VStack align="justify" gap={2}>
        {links.map(link => (
            <Button colorPalette="blue" variant="subtle" disabled={link.active} key={link.name} asChild justifyContent="flex-start">
                <Link prefetch={false} href={link.href}>
                    <link.icon /> {link.name}
                </Link>
            </Button>
        ))}
    </VStack>
}

export default Sidebar;