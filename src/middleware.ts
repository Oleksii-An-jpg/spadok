import { NextResponse , NextRequest} from "next/server";
import { adminAuth } from "@/lib/admin";

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("session");
    if (!sessionCookie) return NextResponse.redirect(new URL("/auth", request.url));

    return NextResponse.next();
    // try {
    //     const decoded = await adminAuth.verifySessionCookie(sessionCookie.value, true);
    //     if (!decoded.admin) return NextResponse.redirect(new URL("/403", request.url));
    //     return NextResponse.next();
    // } catch {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }
}

export const config = { matcher: "/admin/:path*" };
