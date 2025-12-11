// migration-fix-dates.ts
import { admin } from "@/lib/admin";

interface DateIssue {
    id: string;
    name: string;
    oldDates: string[];
    newDates: string[];
    oldYears: string;
    newYears: string;
}

async function analyzeDateIssues(dryRun = true): Promise<DateIssue[]> {
    console.log(dryRun ? "🔍 DRY RUN - No changes will be made" : "⚠️  LIVE RUN - Will update database");

    const snapshot = await admin.collection('items').get();
    const issues: DateIssue[] = [];

    console.log(`\nAnalyzing ${snapshot.size} items...\n`);

    for (const doc of snapshot.docs) {
        const data = doc.data();
        const { date, name } = data;

        if (!date || !Array.isArray(date) || date.length === 0) {
            continue;
        }

        // Parse current dates
        const currentDates = date.map((d: string) => new Date(d));

        // Get years using UTC
        const currentYears = currentDates.map(d => d.getUTCFullYear());

        // Apply correction: 1900 should be 1901 (start of 20th century)
        const correctedYears = currentYears.map(year => year === 1900 ? 1901 : year);

        // Check if there's a discrepancy (either timezone issue OR 1900 edge case)
        const hasIssue = currentYears.some((year, i) => year !== correctedYears[i]);

        if (hasIssue) {
            // Create corrected dates - noon UTC on Jan 1st of each year
            const correctedDates = correctedYears.map(year =>
                new Date(Date.UTC(year, 0, 1, 12, 0, 0)).toISOString()
            );

            issues.push({
                id: doc.id,
                name: name || 'Unnamed',
                oldDates: date,
                newDates: correctedDates,
                oldYears: currentYears.join(' - '),
                newYears: correctedYears.join(' - '),
            });
        }
    }

    console.log(`\n📊 Found ${issues.length} items with timezone issues\n`);

    // Display issues grouped by pattern
    const patterns = new Map<string, DateIssue[]>();
    issues.forEach(issue => {
        const key = `${issue.oldYears} → ${issue.newYears}`;
        if (!patterns.has(key)) patterns.set(key, []);
        patterns.get(key)!.push(issue);
    });

    console.log('Issues grouped by pattern:\n');
    patterns.forEach((items, pattern) => {
        console.log(`${pattern} (${items.length} items):`);
        items.forEach(issue => {
            console.log(`  - ${issue.name} (${issue.id})`);
            console.log(`    Old: ${issue.oldDates.join(', ')}`);
            console.log(`    New: ${issue.newDates.join(', ')}`);
        });
        console.log('');
    });

    // Perform updates if not dry run
    if (!dryRun && issues.length > 0) {
        console.log('🔄 Updating database...\n');

        const batchSize = 500;
        let updated = 0;

        for (let i = 0; i < issues.length; i += batchSize) {
            const batch = admin.batch();
            const batchIssues = issues.slice(i, i + batchSize);

            for (const issue of batchIssues) {
                const docRef = admin.collection('items').doc(issue.id);
                batch.update(docRef, { date: issue.newDates });
            }

            await batch.commit();
            updated += batchIssues.length;
            console.log(`✓ Updated ${updated}/${issues.length} items`);
        }

        console.log(`\n✅ Successfully updated ${updated} items`);
    } else if (issues.length > 0) {
        console.log('💡 To apply these changes, run with dryRun=false');
    }

    return issues;
}

// Run the script
// For dry run (safe, just shows what would change):
// analyzeDateIssues(true).catch(console.error);

// To actually fix the data, uncomment this:
// analyzeDateIssues(false).catch(console.error);

export { analyzeDateIssues };