'use client';

import {useEffect, useState} from "react";
import {onAuthStateChanged, User} from "firebase/auth";
import {auth} from "@/lib/client";
import {startSession} from "@/lib/auth-client";
import {Role} from "@/lib/roles";

export type AuthState = {
    /** False until Firebase has reported the initial auth state. */
    checked: boolean;
    user: User | null;
    /** Role carried by the server session; null while signed out. */
    role: Role | null;
};

/**
 * Mirrors Firebase's client-side session into the server session cookie, so a
 * sign-in through any provider ends up authorised the same way, and a role
 * changed in /admin/accounts is picked up on the next visit.
 */
export function useAuthState(): AuthState {
    const [state, setState] = useState<AuthState>({ checked: false, user: null, role: null });

    useEffect(() => {
        let active = true;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                if (active) setState({ checked: true, user: null, role: null });
                return;
            }

            try {
                const role = await startSession(user);
                if (active) setState({ checked: true, user, role });
            } catch (error) {
                console.error('Не вдалося створити сесію:', error);
                if (active) setState({ checked: true, user, role: null });
            }
        });

        return () => {
            active = false;
            unsubscribe();
        };
    }, []);

    return state;
}
