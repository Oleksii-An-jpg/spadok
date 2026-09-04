import { NextRequest, NextResponse } from 'next/server';
import { setAccountRole } from "@/api/accounts";
import { hasAtLeast, isRole } from "@/lib/roles";
import { getSession } from "@/lib/session";

export async function PATCH(request: NextRequest) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ success: false, message: 'Не авторизовано' }, { status: 401 });
    }

    if (!hasAtLeast(session.role, 'admin')) {
        return NextResponse.json({ success: false, message: 'Недостатньо прав' }, { status: 403 });
    }

    const { uid, role }: { uid?: string; role?: string } = await request.json();

    if (!uid || !isRole(role)) {
        return NextResponse.json({ success: false, message: 'Потрібно вказати обліковий запис і роль' }, { status: 400 });
    }

    // Without this an admin can strip their own rights and leave nobody able to
    // hand them back.
    if (uid === session.uid) {
        return NextResponse.json({ success: false, message: 'Не можна змінити власну роль' }, { status: 400 });
    }

    await setAccountRole(uid, role);

    return NextResponse.json({ success: true, data: { uid, role } });
}
