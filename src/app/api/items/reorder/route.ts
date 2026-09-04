import {NextRequest, NextResponse} from "next/server";
import {moveItem} from "@/api/items";
import { guard } from "@/lib/session";

/**
 * Moves one item within the canonical order, onto the position of the item it
 * was dropped on. Sending a single move rather than the whole sequence keeps
 * the payload page-sized and lets the server apply it transactionally.
 */
export async function PATCH(request: NextRequest) {
    const denied = await guard('editor');
    if (denied) return denied;

    try {
        const { activeId, overId } = await request.json();

        if (!activeId || !overId) {
            return new NextResponse("activeId and overId are required", { status: 400 });
        }

        await moveItem({ activeId, overId });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reorder failed:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
