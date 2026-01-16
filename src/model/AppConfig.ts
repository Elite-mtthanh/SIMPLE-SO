import { ref } from 'vue';
import { Language } from './Enums';

export class AppConfig {
  public static Instance: AppConfig;
  currentLang = ref<Language>(Language.JA);

  languages: Language[] = [
    Language.JA,
    Language.ZH,
    Language.EN,
  ];

  static init(): void {
    this.Instance = new AppConfig();
  }
}