import {NextRequest, NextResponse} from "next/server";
import {updateSubcategoryAssignments} from "@/api/items";

type BodyType = {
    category: string;
    items: string[]
}

export async function PATCH(request: NextRequest) {
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