import { NextRequest, NextResponse } from 'next/server';
import {admin} from "@/lib/admin";
import {CutsConverter} from "@/api/cuts";
import {Cut} from "@/models/cut";
import { guard } from "@/lib/session";

export async function POST(request: NextRequest) {
    const denied = await guard('editor');
    if (denied) return denied;

    const data = await request.json();

    const collection = admin.collection('cuts').withConverter(new CutsConverter());
    const doc = typeof data.id === 'string' && await collection.doc(data.id).get();

    if (typeof data.id === 'string' && doc && doc.exists) {
        await collection.doc(data.id).set(data, { merge: true });
    } else {
        const { id, ...rest } = data;
        await collection.add(rest);
    }

    return NextResponse.json({ success: true, data });
}

export async function DELETE(request: NextRequest) {
    const denied = await guard('editor');
    if (denied) return denied;

    const body: Cut = await request.json();
    if (!body.id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const collection = admin.collection('cuts').withConverter(new CutsConverter());
    const doc = await collection.doc(body.id).get();

    if (!doc.exists) {
        return NextResponse.json({ success: false, message: 'Cut not found' }, { status: 404 });
    }

    await collection.doc(body.id).delete();

    return NextResponse.json({ success: true });
}