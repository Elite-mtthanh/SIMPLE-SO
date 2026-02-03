import { ref, Ref } from 'vue';
import { Language } from './Enums';

export class AppConfig {
  public static Instance: AppConfig;

  /** supported languages */
  languages: Language[] = [
    Language.JA,
    Language.EN,
    Language.ZH,
  ];

  /** current application language */
  currentLang: Ref<Language>;

  /**
   * constructor current application configuration
   */
  constructor() {
    this.currentLang = ref<Language>(this.languages[0]);
  }

  /** initialize singleton instance */
  static init(): void {
    this.Instance = new AppConfig();
  }
}