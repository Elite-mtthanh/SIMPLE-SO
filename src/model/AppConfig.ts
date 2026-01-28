import { ref } from 'vue';
import { Language } from './Enums';

export class AppConfig {
  public static Instance: AppConfig;

  languages: Language[] = [
    Language.JA,
    Language.EN,
    Language.ZH,
  ];

  currentLang = ref<Language>(this.languages[0]);

  static init(): void {
    this.Instance = new AppConfig();
  }
}