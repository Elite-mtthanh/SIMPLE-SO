import { Dict } from '@/model/Dict';
import { Language } from '@/model/Enums';

export function normalizeDictRow(row: any): Dict {
  return new Dict(row.key_name, {
    [Language.JA]: row.ja,
    [Language.ZH]: row.zh,
    [Language.EN]: row.en,
  });
}
