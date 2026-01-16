import { Language } from "./Enums";

export class Dict {
  key: string;
  texts: Record<Language, string>;

  constructor(key: string, texts: Record<Language, string>) {
    this.key = key;
    this.texts = texts;
  }
}