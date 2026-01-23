import { Dict } from '@/model/Dict';
import { Language } from '@/model/Enums';
import { Menu } from '@/model/Menu';

export function normalizeDictRow(row: any): Dict {
  return new Dict(row.key_name, {
    [Language.JA]: row.ja,
    [Language.ZH]: row.zh,
    [Language.EN]: row.en,
  });
}

export function getMenuName(menu: Menu, lang: Language): string {
  switch (lang) {
    case Language.JA: return menu.menu_name1 ?? '';
    case Language.ZH: return menu.menu_name2 ?? '';
    case Language.EN: return menu.menu_name3 ?? '';
    default: return menu.menu_name1 ?? '';
  }
}

export function getMenuDescription(menu: Menu, lang: Language): string {
  switch (lang) {
    case Language.JA: return menu.menu_desc1 ?? '';
    case Language.ZH: return menu.menu_desc2 ?? '';
    case Language.EN: return menu.menu_desc3 ?? '';
    default: return menu.menu_desc1 ?? '';
  }
}