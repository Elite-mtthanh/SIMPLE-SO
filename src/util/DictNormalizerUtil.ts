import { Dict } from '@/model/Dict';
import { Language } from '@/model/Enums';
import { Menu, MenuSelect } from '@/model/Menu';

/**
 * Normalize dictionary row data into Dict object
 * @param row raw dictionary data from database
 * @returns normalized Dict object with multi-language support
 */
export function normalizeDictRow(row: any): Dict {
  return new Dict(row.key_name, {
    [Language.JA]: row.ja,
    [Language.ZH]: row.zh,
    [Language.EN]: row.en,
  });
}

/**
 * Get menu name based on language
 * @param menu menu item object
 * @param lang target language (JA/ZH/EN)
 * @returns localized menu name
 */
export function getMenuName(menu: Menu, lang: Language): string {
  switch (lang) {
    case Language.JA: return menu.menu_name1 ?? '';
    case Language.ZH: return menu.menu_name2 ?? '';
    case Language.EN: return menu.menu_name3 ?? '';
    default: return menu.menu_name1 ?? '';
  }
}

/**
 * Get menu description based on language
 * @param menu menu item object
 * @param lang target language (JA/ZH/EN)
 * @returns localized menu description
 */
export function getMenuDescription(menu: Menu, lang: Language): string {
  switch (lang) {
    case Language.JA: return menu.menu_desc1 ?? '';
    case Language.ZH: return menu.menu_desc2 ?? '';
    case Language.EN: return menu.menu_desc3 ?? '';
    default: return menu.menu_desc1 ?? '';
  }
}

/**
 * Get menu select name based on language
 * @param menuSelect menu select item (size/topping option)
 * @param lang target language (JA/ZH/EN)
 * @returns localized select option name
 */
export function getMenuSelectName(menuSelect: MenuSelect, lang: Language): string {
  switch (lang) {
    case Language.JA: return menuSelect.select_name1 ?? '';
    case Language.ZH: return menuSelect.select_name2 ?? '';
    case Language.EN: return menuSelect.select_name3 ?? '';
    default: return menuSelect.select_name1 ?? '';
  }
}

/**
 * Normalize a text string by replacing multiple newline characters
 * @param text The text string to be normalized.
 * @returns The normalized text string.
 */
export function normalizeTextWithLineLimit(
  text?: string,
  maxLines = 2
): string {
  if (!text) return '';

  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length <= maxLines) {
    return lines.join('\n');
  }

  return (
    lines.slice(0, maxLines).join('\n') + '…'
  );
}


