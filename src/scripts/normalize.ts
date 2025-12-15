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
    // Exact match required
    return startYear !== idealStart || endYear !== idealEnd;
}

// Try to infer intended pattern from approximate dates
function inferIntendedPattern(
    startYear: number,
    endYear: number,
    century: Century
): Part | null {
    const centuryNumber = getCenturyNumber(century);
    const centuryStart = (centuryNumber - 1) * 100;
    const offset = startYear - centuryStart;
    const duration = endYear - startYear + 1;

    // Check if close to BEGINNING (years 1-5, duration 5)
    if (duration >= 4 && duration <= 7 && offset >= 0 && offset <= 5) {
        return Part.BEGINNING;
    }

    // Check if close to MIDDLE (years 26-75, duration 50)
    if (duration >= 45 && duration <= 55 && offset >= 20 && offset <= 30) {
        return Part.MIDDLE;
    }

    // Check if close to END (years 96-100, duration 5)
    if (duration >= 4 && duration <= 7 && offset >= 91 && offset <= 97) {
        return Part.END;
    }

    return null;
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

        // First check: if it already matches a special pattern exactly, skip it
        if (
            info.part &&
            info.century &&
            (info.part === Part.BEGINNING ||
                info.part === Part.MIDDLE ||
                info.part === Part.END)
        ) {
            continue;
        }

        // Second check: try to infer what pattern this SHOULD be
        // by looking at the start year's century
        const century = info.century;
        if (!century) continue;

        const intendedPart = inferIntendedPattern(startYear, endYear, century);
        if (!intendedPart) continue;

        // Get ideal range for the inferred pattern
        const idealRange = getIdealDateRange(century, intendedPart);
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
                pattern: `${intendedPart} ${century} ст.`,
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

// To actually normalize the data, uncomment this:
// normalizeSpecialParts(false).catch(console.error);

export { normalizeSpecialParts };