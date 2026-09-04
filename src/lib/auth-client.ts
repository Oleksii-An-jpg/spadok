'use client';

import { signOut, User } from "firebase/auth";
import { auth } from "@/lib/client";
import { createSession, destroySession } from "@/app/actions";
import { Role } from "@/lib/roles";

/**
 * Firebase keeps its own client-side session, but everything server-side is
 * driven by the httpOnly session cookie. These two helpers keep the pair in
 * step: never sign in or out without going through them.
 */
export async function startSession(user: User): Promise<Role> {
    const token = await user.getIdToken(true);
    const { role } = await createSession(token);
    return role;
}

export async function endSession(): Promise<void> {
    await destroySession();
    await signOut(auth);
}
