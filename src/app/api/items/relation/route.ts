import {admin} from "@/lib/admin";
import {NextRequest, NextResponse} from "next/server";
import {Relation} from "@/models/relation";
import {RelationConverter} from "@/api/items";
import { guard } from "@/lib/session";

export async function PATCH(request: NextRequest) {
    const denied = await guard('editor');
    if (denied) return denied;

    const body: Relation = await request.json();

    if (!body.id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const { id, related } = body;

    const collection = admin.collection('related-items').withConverter(new RelationConverter());
    await collection.doc(id).set({
        related
    }, { merge: true });

    return NextResponse.json({ success: true });
}