// migration-normalize-dates.ts
import { admin } from "@/lib/admin";
import { extractCenturyPartAndFraction, getCenturyNumber, Century, Part } from "@/lib/utils";

interface NormalizeIssue {
    id: string;
    name: string;
    oldDates: string[];
    newDates: string[];
    oldRange: string;
    newRange: string;
    pattern: string;
}

// Get ideal date ranges for each pattern
function getIdealDateRange(
    century: Century,
    part: Part
): [number, number] | null {
    const centuryNumber = getCenturyNumber(century);
    const centuryStart = (centuryNumber - 1) * 100;

    switch (part) {
        case Part.BEGINNING:
            return [centuryStart + 1, centuryStart + 5];
        case Part.MIDDLE:
            return [centuryStart + 26, centuryStart + 75];
        case Part.END:
            return [centuryStart + 96, centuryStart + 100];
        default:
            return null;
    }
}

// Check if dates need normalization
function needsNormalization(
    startYear: number,
    endYear: number,
    idealStart: number,
    idealEnd: number
): boolean {
    // Allow small tolerance (±2 years on each end)
    const tolerance = 2;
    return (
        Math.abs(startYear - idealStart) > tolerance ||
        Math.abs(endYear - idealEnd) > tolerance
    );
}

async function normalizeSpecialParts(dryRun = true): Promise<NormalizeIssue[]> {
    console.log(
        dryRun
            ? "🔍 DRY RUN - Analyzing date ranges that need normalization"
            : "⚠️  LIVE RUN - Will normalize date ranges"
    );

    const snapshot = await admin.collection("items").get();
    const issues: NormalizeIssue[] = [];

    console.log(`\nAnalyzing ${snapshot.size} items...\n`);

    for (const doc of snapshot.docs) {
        const data = doc.data();
        const { date, name } = data;

        if (!date || !Array.isArray(date) || date.length !== 2) {
            continue;
        }

        // Parse current dates
        const currentDates = date.map((d: string) => new Date(d));
        const startYear = currentDates[0].getUTCFullYear();
        const endYear = currentDates[1].getUTCFullYear();

        // Extract current interpretation
        const info = extractCenturyPartAndFraction(currentDates);

        // Only normalize BEGINNING, MIDDLE, END (special parts without fractions)
        if (
            !info.part ||
            !info.century ||
            (info.part !== Part.BEGINNING &&
                info.part !== Part.MIDDLE &&
                info.part !== Part.END)
        ) {
            continue;
        }

        // Get ideal range
        const idealRange = getIdealDateRange(info.century, info.part);
        if (!idealRange) continue;

        const [idealStart, idealEnd] = idealRange;

        // Check if normalization needed
        if (needsNormalization(startYear, endYear, idealStart, idealEnd)) {
            const newDates = [
                new Date(Date.UTC(idealStart, 0, 1, 12, 0, 0)).toISOString(),
                new Date(Date.UTC(idealEnd, 0, 1, 12, 0, 0)).toISOString(),
            ];

            issues.push({
                id: doc.id,
                name: name || "Unnamed",
                oldDates: date,
                newDates,
                oldRange: `${startYear}-${endYear}`,
                newRange: `${idealStart}-${idealEnd}`,
                pattern: `${info.part} ${info.century} ст.`,
            });
        }
    }

    console.log(`\n📊 Found ${issues.length} items that need normalization\n`);

    // Group by pattern
    const patterns = new Map<string, NormalizeIssue[]>();
    issues.forEach((issue) => {
        const key = issue.pattern;
        if (!patterns.has(key)) patterns.set(key, []);
        patterns.get(key)!.push(issue);
    });

    console.log("Items grouped by pattern:\n");
    patterns.forEach((items, pattern) => {
        console.log(`${pattern} (${items.length} items):`);
        items.forEach((issue) => {
            console.log(`  - ${issue.name} (${issue.id})`);
            console.log(`    ${issue.oldRange} → ${issue.newRange}`);
        });
        console.log("");
    });

    // Perform updates if not dry run
    if (!dryRun && issues.length > 0) {
        console.log("🔄 Normalizing dates in database...\n");

        const batchSize = 500;
        let updated = 0;

        for (let i = 0; i < issues.length; i += batchSize) {
            const batch = admin.batch();
            const batchIssues = issues.slice(i, i + batchSize);

            for (const issue of batchIssues) {
                const docRef = admin.collection("items").doc(issue.id);
                batch.update(docRef, { date: issue.newDates });
            }

            await batch.commit();
            updated += batchIssues.length;
            console.log(`✓ Normalized ${updated}/${issues.length} items`);
        }

        console.log(`\n✅ Successfully normalized ${updated} items`);
    } else if (issues.length > 0) {
        console.log("💡 To apply these changes, run with dryRun=false");
    } else {
        console.log("✨ All dates are already normalized!");
    }

    return issues;
}

// Run the script
// For dry run (safe, just shows what would change):
// normalizeSpecialParts(true).catch(console.error);

// To actually normalize the data, uncomment this:
// normalizeSpecialParts(false).catch(console.error);

export { normalizeSpecialParts };