/**
 * Utility function to format prices in Ugandan Shillings (UGX)
 * @param amount - The amount to format
 * @returns Formatted string with UGX prefix and comma separators
 */
export function formatUGX(amount: number): string {
  return `UGX ${amount.toLocaleString()}`;
}

/**
 * Utility function to format discount percentage
 * @param originalPrice - Original price
 * @param salePrice - Sale/current price
 * @returns Discount percentage as integer
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}