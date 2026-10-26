enum Currency {
    UAH = '₴',
    USD = '$',
}

// Splits the whole part into groups of three digits, so 1035254.18 reads
// "1 035 254.18". Non-breaking spaces keep a sum from wrapping mid-number.
const groupThousands = (value: string): string => {
    const [whole, fraction] = value.split('.');
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return fraction === undefined ? grouped : `${grouped}.${fraction}`;
};

export const getDisplayPrice = (
    price: number | string,
    currency: Currency = Currency.UAH,
    hideZeroFraction: boolean = false
): string => {
    // The admin form used to save sums as text, so a numeric string is treated
    // as a number; anything else is shown as it was typed.
    if (typeof price === 'string') {
        const parsed = Number(price);
        if (!price.trim() || !Number.isFinite(parsed)) {
            return price;
        }
        price = parsed;
    }

    if (hideZeroFraction && !(price % 1)) {
        return `${groupThousands(String(price))}${currency}`;
    }

    return `${groupThousands(price.toFixed(2))}${currency}`;
};
