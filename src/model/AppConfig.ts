import { ref, Ref } from 'vue';
import { Language } from './Enums';
import { ServiceIF } from '@/services/ServiceIF';
export class AppConfig {
  public static Instance: AppConfig;

  /** 
   * supported languages list from Config.json
   * retrieves language list from configuration file (e.g., ["ja", "en", "zh"])
   */
  languages: Language[] = ServiceIF.getConfig().languageList as Language[];

  /** current application language */
  currentLang: Ref<Language>;

  /**
   * constructor - initializes application configuration
   * sets default language to first language in the list
   */
  constructor() {
    this.currentLang = ref<Language>(this.languages[0]);
  }

  /** 
   * initialize singleton instance
   * creates and stores the single instance of AppConfig
   */
  static init(): void {
    this.Instance = new AppConfig();
  }
}
