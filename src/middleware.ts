import { NextResponse , NextRequest} from "next/server";
import { jwtDecode } from 'jwt-decode'

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("session");
    if (!sessionCookie) return NextResponse.redirect(new URL("/auth", request.url));

    try {
        const s = jwtDecode<{ admin: boolean }>(sessionCookie.value);
        console.log(s);
        if (!s) return NextResponse.redirect(new URL("/403", request.url));
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = { matcher: "/admin/:path*" };
