export const ROLES = ['admin', 'editor', 'viewer', 'guest'] as const;

export type Role = typeof ROLES[number];

export const ROLE_LABELS: Record<Role, string> = {
    admin: 'Адмін',
    editor: 'Редактор',
    viewer: 'Глядач',
    guest: 'Гість',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
    admin: 'Повний доступ, зокрема керування правами',
    editor: 'Може створювати й редагувати вміст',
    viewer: 'Лише перегляд адмінки',
    guest: 'Без доступу до адмінки',
};

// Higher rank grants everything a lower rank grants.
const ROLE_RANK: Record<Role, number> = {
    guest: 0,
    viewer: 1,
    editor: 2,
    admin: 3,
};

export function isRole(value: unknown): value is Role {
    return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

/**
 * Reads a role out of whatever claim bag is at hand: a decoded ID token, a
 * decoded session cookie, or a UserRecord's custom claims. Accounts created
 * before roles existed carry a boolean `admin` claim instead.
 */
export function roleFromClaims(claims: unknown): Role {
    if (!claims || typeof claims !== 'object') return 'guest';

    const { role, admin } = claims as { role?: unknown; admin?: unknown };

    if (isRole(role)) return role;
    if (admin === true) return 'admin';

    return 'guest';
}

export function hasAtLeast(role: Role, required: Role): boolean {
    return ROLE_RANK[role] >= ROLE_RANK[required];
}

export function canEdit(role: Role): boolean {
    return hasAtLeast(role, 'editor');
}

export function canManageAccounts(role: Role): boolean {
    return hasAtLeast(role, 'admin');
}
