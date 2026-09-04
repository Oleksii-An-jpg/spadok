import {NextRequest, NextResponse} from "next/server";
import {moveItem} from "@/api/items";
import { guard } from "@/lib/session";

/**
 * Moves one item within the canonical order, either onto the position of
 * another item (a drag) or by a relative offset (the up/down buttons). Sending
 * a single move rather than the whole sequence keeps the payload small enough
 * to stay page-sized and lets the server apply it transactionally.
 */
export async function PATCH(request: NextRequest) {
    const denied = await guard('editor');
    if (denied) return denied;

    try {
        const { activeId, overId, delta } = await request.json();

        if (!activeId) {
            return new NextResponse("activeId is required", { status: 400 });
        }

        if (overId === undefined && typeof delta !== 'number') {
            return new NextResponse("Either overId or a numeric delta is required", { status: 400 });
        }

        // A null drop target would otherwise be looked up as a real id.
        await moveItem({ activeId, overId: overId ?? undefined, delta });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reorder failed:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
