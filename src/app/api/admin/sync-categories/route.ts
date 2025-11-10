// app/api/admin/sync-algolia/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {syncCategories} from "@/scripts/sync-categories";

export async function GET(_: NextRequest) {
    try {
        await syncCategories();

        return NextResponse.json({
            success: true,
            message: `Successfully synced categories`
        });

    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}