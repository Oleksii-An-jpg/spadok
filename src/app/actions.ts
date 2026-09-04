'use server';
import { cookies } from 'next/headers'
import { adminAuth } from "@/lib/admin";
import { Role, roleFromClaims } from "@/lib/roles";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/session-cookie";

/**
 * Exchanges a freshly minted Firebase ID token for an httpOnly session cookie
 * and reports back the role it carries, so the caller can route accordingly.
 */
export async function createSession(token: string): Promise<{ role: Role }> {
    const cookieStore = await cookies()
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn: SESSION_MAX_AGE_MS });

    cookieStore.set({
        name: SESSION_COOKIE,
        value: sessionCookie,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: Date.now() + SESSION_MAX_AGE_MS
    });

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

    return { role: roleFromClaims(decoded) };
}

export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}
