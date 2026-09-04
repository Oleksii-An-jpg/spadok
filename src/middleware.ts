import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from 'jwt-decode';
import { hasAtLeast, roleFromClaims } from "@/lib/roles";
import { SESSION_COOKIE } from "@/lib/session-cookie";

/**
 * A fast pre-filter only: the edge runtime cannot verify the cookie signature,
 * so it just reads the claims to avoid rendering the admin shell for people who
 * clearly may not see it. The authoritative check runs in the admin layout and
 * in every write route handler, both of which call into firebase-admin.
 */
export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE);

    if (!sessionCookie) return redirectTo('/auth', request);

    try {
        const claims = jwtDecode<{ role?: unknown; admin?: unknown; exp?: number }>(sessionCookie.value);

        if (typeof claims.exp === 'number' && claims.exp * 1000 <= Date.now()) {
            return signOut(request);
        }

        if (!hasAtLeast(roleFromClaims(claims), 'viewer')) {
            return redirectTo('/403', request);
        }

        return NextResponse.next();
    } catch {
        return signOut(request);
    }
}

function redirectTo(pathname: string, request: NextRequest) {
    return NextResponse.redirect(new URL(pathname, request.url));
}

function signOut(request: NextRequest) {
    const response = redirectTo('/auth', request);
    response.cookies.delete(SESSION_COOKIE);
    return response;
}

export const config = { matcher: "/admin/:path*" };
