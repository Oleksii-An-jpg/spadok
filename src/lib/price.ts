enum Currency {
    UAH = '₴',
    USD = '$',
}

export const getDisplayPrice = (
    price: number | string,
    currency: Currency = Currency.UAH,
    hideZeroFraction: boolean = false
): string => {
    if (typeof price === 'string') {
        return price;
    }

    if (hideZeroFraction && !(price % 1)) {
        return `${String(price)}${currency}`;
    }

    return `${price.toFixed(2)}${currency}`;
};