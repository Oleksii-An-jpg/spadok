import {NextRequest, NextResponse} from "next/server";
import {reorderItems} from "@/api/items";

export async function PATCH(request: NextRequest) {
    try {
        const { ids } = await request.json();

        if (!Array.isArray(ids)) {
            return new Response("Invalid ID array", { status: 400 });
        }

        await reorderItems(ids);

        return NextResponse.json({ success: true, ids });
    } catch (error) {
        console.error("Reorder failed:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}