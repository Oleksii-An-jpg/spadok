import {NextRequest, NextResponse} from "next/server";
import {updateSubcategoryAssignments} from "@/api/items";
import { guard } from "@/lib/session";

type BodyType = {
    category: string;
    items: string[]
}

export async function PATCH(request: NextRequest) {
    const denied = await guard('editor');
    if (denied) return denied;

    const body: BodyType = await request.json();
    if (!body.category) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    if (!body.items) {
        return NextResponse.json({ success: false, message: 'items are required' }, { status: 400 });
    }

    const result = await updateSubcategoryAssignments(body.category, body.items);

    return NextResponse.json({ success: result.success });
}