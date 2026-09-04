import {NextRequest, NextResponse} from "next/server";
import {reorderMembers} from "@/api/members";
import { guard } from "@/lib/session";

export async function PATCH(request: NextRequest) {
    const denied = await guard('editor');
    if (denied) return denied;

    try {
        const { ids } = await request.json();

        if (!Array.isArray(ids)) {
            return new NextResponse("Invalid ID array", { status: 400 });
        }

        await reorderMembers(ids);

        return NextResponse.json({ success: true, ids });
    } catch (error) {
        console.error("Reorder failed:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
