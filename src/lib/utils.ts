export enum DateType {
    CENTURIES = 'Століття',
    PARTS = 'Частини (типу, друга половина XIX ст.)',
    DECADES = 'Декади (20рр., 40рр. і так далі)',
    YEARS = 'Роки'
}

export enum Century {
    XV = 'XV',
    XVI = 'XVI',
    XVII = 'XVII',
    XVIII = 'XVIII',
    XIX = 'XIX',
    XX = 'XX',
    XXI = 'XXI'
}

export enum Fraction {
    HALF = 'Половина',
    THIRD = 'Третина',
    QUARTER = 'Чверть',
}

export enum Part {
    FIRST = 'Перша',
    SECOND = 'Друга',
    THIRD = 'Третя',
    FOURTH = 'Четверта',
    LAST = 'Остання',
    BEGINNING = 'Початок',
    MIDDLE = 'Середина',
    END = 'Кінець'
}

// Helper to get century number
export const getCenturyNumber = (century: Century): number => {
    const mapping: Record<Century, number> = {
        [Century.XV]: 15,
        [Century.XVI]: 16,
        [Century.XVII]: 17,
        [Century.XVIII]: 18,
        [Century.XIX]: 19,
        [Century.XX]: 20,
        [Century.XXI]: 21,
    };
    return mapping[century];
};

// Helper to get fraction length in years
const getFractionLength = (fraction: Fraction): number => {
    switch (fraction) {
        case Fraction.HALF:
            return 50;
        case Fraction.THIRD:
            return 33; // Using 33 for cleaner divisions
        case Fraction.QUARTER:
            return 25;
    }
};

// Validate part and fraction combinations
export const validateCombination = (part: Part, fraction?: Fraction): string | null => {
    // Special parts don't need fractions
    if (part === Part.BEGINNING || part === Part.END || part === Part.MIDDLE) {
        if (fraction) {
            return "Fraction is not needed for BEGINNING, END, or MIDDLE parts.";
        }
        return null;
    }

    // LAST can work with or without fraction
    if (part === Part.LAST) {
        if (fraction && fraction === Fraction.THIRD) {
            return "LAST third doesn't make logical sense.";
        }
        return null;
    }

    // Regular parts need fractions
    if (!fraction) {
        return "Fraction must be provided for FIRST, SECOND, THIRD, and FOURTH parts.";
    }

    // Validate logical combinations
    if (part === Part.THIRD && fraction === Fraction.HALF) {
        return "There can't be a third half.";
    }
    if (part === Part.FOURTH && fraction !== Fraction.QUARTER) {
        return "There can't be a fourth half or third.";
    }

    return null;
};

// Create date range tuple based on century, part, and fraction
export const createDateTuple = (
    century: Century,
    part: Part,
    fraction?: Fraction
): [Date, Date] => {
    const validationError = validateCombination(part, fraction);
    if (validationError) {
        throw new Error(validationError);
    }

    const centuryNumber = getCenturyNumber(century);
    const centuryStartYear = (centuryNumber - 1) * 100;

    let startYear: number;
    let endYear: number;

    // Handle special parts
    if (part === Part.BEGINNING) {
        startYear = centuryStartYear + 1;
        endYear = centuryStartYear + 5;
    } else if (part === Part.MIDDLE) {
        startYear = centuryStartYear + 26;
        endYear = centuryStartYear + 75;
    } else if (part === Part.END) {
        startYear = centuryStartYear + 96;
        endYear = centuryStartYear + 100;
    } else if (part === Part.LAST) {
        // LAST without fraction means last quarter
        const partLength = fraction ? getFractionLength(fraction) : 25;
        startYear = centuryStartYear + 100 - partLength + 1;
        endYear = centuryStartYear + 100;
    } else {
        // Regular parts (FIRST, SECOND, THIRD, FOURTH)
        if (!fraction) {
            throw new Error("Fraction required for numbered parts");
        }

        const partLength = getFractionLength(fraction);
        const partIndex = getPartIndex(part);

        startYear = centuryStartYear + partLength * partIndex + 1;
        endYear = startYear + partLength - 1;
    }

    return [new Date(startYear, 0, 1), new Date(endYear, 11, 31)];
};

// Get numeric index for regular parts
const getPartIndex = (part: Part): number => {
    switch (part) {
        case Part.FIRST: return 0;
        case Part.SECOND: return 1;
        case Part.THIRD: return 2;
        case Part.FOURTH: return 3;
        default: throw new Error("Invalid part for index calculation");
    }
};

// Get full century date range
export const getCenturyDatesRange = (century: Century): [Date, Date] => {
    const centuryNumber = getCenturyNumber(century);
    const startYear = (centuryNumber - 1) * 100 + 1;
    const endYear = centuryNumber * 100;

    return [new Date(startYear, 0, 1), new Date(endYear, 11, 31)];
};

// Infer century from year
export const getCenturyFromYear = (year: number): Century => {
    const centuryNumber = Math.floor((year - 1) / 100) + 1;

    const mapping: Record<number, Century> = {
        15: Century.XV,
        16: Century.XVI,
        17: Century.XVII,
        18: Century.XVIII,
        19: Century.XIX,
        20: Century.XX,
        21: Century.XXI,
    };

    if (!mapping[centuryNumber]) {
        throw new Error(`Year ${year} out of supported range`);
    }

    return mapping[centuryNumber];
};

// Infer fraction from duration
const inferFraction = (duration: number): Fraction | undefined => {
    switch (duration) {
        case 50: return Fraction.HALF;
        case 33: return Fraction.THIRD;
        case 25: return Fraction.QUARTER;
        default: return undefined;
    }
};

// Infer part from start year and century
const inferPart = (
    startYear: number,
    endYear: number,
    centuryStartYear: number,
    fraction?: Fraction
): Part | undefined => {
    const duration = endYear - startYear + 1;
    const offset = startYear - centuryStartYear;

    // Check for special parts
    if (duration === 5 && offset === 1) return Part.BEGINNING;
    if (duration === 5 && offset === 96) return Part.END;
    if (duration === 50 && offset === 26) return Part.MIDDLE;

    if (!fraction) return undefined;

    const partLength = getFractionLength(fraction);

    // Check for LAST
    if (offset === 100 - partLength + 1) return Part.LAST;

    // Check for regular parts
    if ((offset - 1) % partLength === 0) {
        const index = (offset - 1) / partLength;
        switch (index) {
            case 0: return Part.FIRST;
            case 1: return Part.SECOND;
            case 2: return Part.THIRD;
            case 3: return Part.FOURTH;
        }
    }

    return undefined;
};

// Infer date type from duration
const inferDateType = (duration: number): DateType => {
    if (duration === 100) return DateType.CENTURIES;
    if (duration === 10) return DateType.DECADES;
    if (duration === 1) return DateType.YEARS;
    return DateType.PARTS;
};

export interface ExtractedDateInfo {
    dateType?: DateType;
    century?: Century;
    part?: Part;
    fraction?: Fraction;
    decade?: number; // 0-9 for decades within a century
}

// Extract all date components from date range
export const extractCenturyPartAndFraction = (dates?: Date[]): ExtractedDateInfo => {
    if (!dates || dates.length === 0) {
        return {};
    }

    const startYear = dates[0].getFullYear();
    const endYear = dates.length === 2 ? dates[1].getFullYear() : startYear;
    const duration = endYear - startYear + 1;

    const dateType = inferDateType(duration);
    const century = getCenturyFromYear(startYear);

    if (dateType === DateType.YEARS || dateType === DateType.DECADES) {
        if (dateType === DateType.DECADES) {
            return {
                dateType,
                century,
                decade: Math.floor((startYear % 100) / 10)
            }
        } else {
            return { dateType };
        }
    }

    // For full century
    if (dateType === DateType.CENTURIES) {
        return { dateType, century };
    }

    // For parts
    const centuryStartYear = (Math.floor((startYear - 1) / 100)) * 100;
    const fraction = inferFraction(duration);
    const part = inferPart(startYear, endYear, centuryStartYear, fraction);

    return {
        dateType,
        century,
        part,
        fraction
    };
};

// Utility for sorting by name
export const sortAlphabetically = <T extends { name: string }>(a: T, b: T): number => {
    return a.name.localeCompare(b.name, 'uk'); // Ukrainian locale for proper sorting
};