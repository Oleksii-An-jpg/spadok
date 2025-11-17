import { NextRequest, NextResponse } from 'next/server';
import {admin} from "@/lib/admin";
import {RegionConverter} from "@/api/regions";
import {Region} from "@/models/region";

export async function POST(request: NextRequest) {
    const data = await request.json();

    const collection = admin.collection('regions').withConverter(new RegionConverter());
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
    const body: Region = await request.json();
    if (!body.id) {
        return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    const collection = admin.collection('regions').withConverter(new RegionConverter());
    const doc = await collection.doc(body.id).get();

    if (!doc.exists) {
        return NextResponse.json({ success: false, message: 'Cut not found' }, { status: 404 });
    }

    await collection.doc(body.id).delete();

    return NextResponse.json({ success: true });
}