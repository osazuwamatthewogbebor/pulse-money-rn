/**
 * Formats a numeric dollar amount into clean localized currency ($24,580.40)
 * Safely eliminates float drift by locking to 2 decimal places.
 */
export const formatCurrency = (
    amount: number,
    currencyCode: string = 'USD',
): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

/**
 * Formats signed transaction amounts (+ $4,250.00 / - $129.00)
 */
export const formatTransactionAmount = (
    amount: number,
    currencyCode: string = 'USD'
): { formatted: string,  isPositive: boolean } => {
    const isPositive = amount > 0;
    const absFormatted = formatCurrency(Math.abs(amount), currencyCode);

    return {
        formatted: isPositive 
            ? `+${absFormatted}` 
            : amount === 0 
            ? '0'
            : `-${absFormatted}`,
        isPositive,
    }
};

/**
 * Convert integer cents (stored in DB) to decimal dollars for display
 */
export const centsToDollars = (cents: number): number => {
    return Math.round(cents) / 100;
};

/**
 * Convert dollars to integer cents for safe math calculations
 */
export const dollarsToCents = (dollars: number): number => {
    return Math.round(dollars * 100);
};