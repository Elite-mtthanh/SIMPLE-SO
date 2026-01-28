/**
 * Format price number with locale-specific formatting
 * @param price price value to format
 * @param locale locale string (default: 'en-US'). Examples: 'ja-JP', 'zh-CN', 'en-US'
 * @returns formatted price string with thousand separators according to locale
 */
export function formatPrice(price: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(price);
}
