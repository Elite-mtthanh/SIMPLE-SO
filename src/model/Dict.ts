import { Language } from "./enums";

export class Dict {
  key: string;
  texts: Record<Language, string>;

  constructor(key: string, texts: Record<Language, string>) {
    this.key = key;
    this.texts = texts;
  }
}