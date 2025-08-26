'use server'

import {adminAuth} from "@/lib/admin";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {ReactNode} from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) redirect("/auth");

    try {
        const decoded = await adminAuth.verifySessionCookie(sessionCookie.value, true);
        if (!decoded.admin) redirect("/403");
    } catch {
        redirect("/auth");
    }

    return children;
}