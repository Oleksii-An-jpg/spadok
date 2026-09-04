import { NextRequest, NextResponse } from 'next/server';
import {seedMembers} from "@/scripts/seed-members";

export async function GET(_: NextRequest) {
    try {
        const { imported, skipped } = await seedMembers();

        return NextResponse.json({
            success: true,
            message: `Successfully imported ${imported} members, ${skipped} already existed`
        });

    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
