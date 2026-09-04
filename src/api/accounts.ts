'server only';
import {adminAuth} from "@/lib/admin";
import {UserRecord} from "firebase-admin/auth";
import {Role, roleFromClaims} from "@/lib/roles";
import {Account} from "@/models/account";

function toAccount(user: UserRecord): Account {
    return {
        uid: user.uid,
        displayName: user.displayName ?? null,
        email: user.email ?? null,
        phoneNumber: user.phoneNumber ?? null,
        photoURL: user.photoURL ?? null,
        role: roleFromClaims(user.customClaims),
        disabled: user.disabled,
        lastSignInTime: user.metadata.lastSignInTime ?? null,
    };
}

export async function getAccounts(): Promise<Account[]> {
    const accounts: Account[] = [];
    let pageToken: string | undefined;

    do {
        const result = await adminAuth.listUsers(1000, pageToken);
        accounts.push(...result.users.map(toAccount));
        pageToken = result.pageToken;
    } while (pageToken);

    return accounts.sort((a, b) => (a.displayName ?? a.email ?? a.uid).localeCompare(b.displayName ?? b.email ?? b.uid, 'uk'));
}

/**
 * Replaces the account's custom claims with the new role. The legacy boolean
 * `admin` claim is dropped on the way, so a user only ever carries one source
 * of truth.
 */
export async function setAccountRole(uid: string, role: Role): Promise<void> {
    const user = await adminAuth.getUser(uid);
    const claims = { ...user.customClaims };
    delete claims.admin;
    delete claims.role;

    await adminAuth.setCustomUserClaims(uid, { ...claims, role });

    // Force the next request to re-mint a session cookie with the new claims.
    await adminAuth.revokeRefreshTokens(uid);
}
