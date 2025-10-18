import { NextResponse , NextRequest} from "next/server";
import { jwtDecode } from 'jwt-decode'
import {auth} from "@/lib/client";

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("session");
    if (!sessionCookie) return NextResponse.redirect(new URL("/auth", request.url));

    try {
        const { admin } = jwtDecode<{ admin: boolean }>(sessionCookie.value);
        if (!admin) return NextResponse.redirect(new URL("/403", request.url));
        return NextResponse.next();
    } catch {
        await auth.signOut();
        return NextResponse.redirect(new URL("/auth", request.url));
    }
}

export const config = { matcher: "/admin/:path*" };
