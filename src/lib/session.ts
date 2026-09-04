import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {NextResponse} from "next/server";
import {adminAuth} from "@/lib/admin";
import {hasAtLeast, Role, roleFromClaims} from "@/lib/roles";

export const SESSION_COOKIE = 'session';

export type Session = {
    uid: string;
    email: string | null;
    name: string | null;
    picture: string | null;
    role: Role;
};

/**
 * Verifies the session cookie against Firebase and resolves the caller's role.
 * Returns null for anonymous, expired or revoked sessions.
 */
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);

    if (!sessionCookie) return null;

    try {
        const decoded = await adminAuth.verifySessionCookie(sessionCookie.value, true);

        return {
            uid: decoded.uid,
            email: decoded.email ?? null,
            name: (decoded.name as string | undefined) ?? null,
            picture: (decoded.picture as string | undefined) ?? null,
            role: roleFromClaims(decoded),
        };
    } catch {
        return null;
    }
}

/**
 * For server components and layouts: redirects instead of returning when the
 * caller may not proceed.
 */
export async function requireRole(required: Role): Promise<Session> {
    const session = await getSession();

    if (!session) redirect('/auth');
    if (!hasAtLeast(session.role, required)) redirect('/403');

    return session;
}

/**
 * For route handlers: returns a response to send back, or null when the caller
 * is allowed through.
 */
export async function guard(required: Role): Promise<NextResponse | null> {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ success: false, message: 'Не авторизовано' }, { status: 401 });
    }

    if (!hasAtLeast(session.role, required)) {
        return NextResponse.json({ success: false, message: 'Недостатньо прав' }, { status: 403 });
    }

    return null;
}
