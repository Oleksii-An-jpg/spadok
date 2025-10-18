// app/api/rest/items/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchItems } from '@/lib/algolia';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const category = searchParams.get('category');
        const region = searchParams.get('region');
        const page = parseInt(searchParams.get('page') || '0');
        const hitsPerPage = parseInt(searchParams.get('limit') || '20');

        const filters: string[] = ['published:true'];

        if (category) {
            filters.push(`mainCategory:"${category}"`);
        }

        if (region) {
            filters.push(`region:"${region}"`);
        }

        const response = await searchItems(
            query,
            filters.join(' AND '),
            page,
            hitsPerPage
        );

        const result = response.results[0];

        // Type guard to check if it's a search response (not facet response)
        if ('hits' in result) {
            return NextResponse.json({
                items: result.hits,
                total: result.nbHits,
                page: result.page,
                pages: result.nbPages,
                hitsPerPage: result.hitsPerPage,
                query: result.query,
            });
        }

        // Shouldn't happen, but handle it
        return NextResponse.json({
            items: [],
            total: 0,
            page: 0,
            pages: 0,
            hitsPerPage,
            query,
        });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}