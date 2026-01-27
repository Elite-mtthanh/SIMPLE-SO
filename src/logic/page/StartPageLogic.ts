import { ref, Ref } from 'vue';
import { SplashConfig } from '@/model/Splash';
import { ServiceIF } from '@/services/ServiceIF';
import { Language } from '@/model/Enums';
import { GlobalEvent } from '../common/GlobalEvent';
import { FooterLogic } from '../common/FooterLogic';
import { AppConfig } from '@/model/AppConfig';

export class StartPageLogic {
  private footerLogic = new FooterLogic();
  private config = AppConfig.Instance;

  /** splash screen data */
  splashData: Ref<SplashConfig | null> = ref(null);

  /** get current language */
  get currentLang(): Ref<Language> {
    return this.config.currentLang;
  }

  /** get allergen dialog visibility status */
  get showAllergen(): Ref<boolean> {
    return this.footerLogic.showAllergen;
  }

  /** get available language options */
  get languageOptions() {
    return this.footerLogic.languageOptions;
  }

  /**
   * activate start page and load splash guide data
   */
  async activate(): Promise<void> {
    this.splashData.value = ServiceIF.getSplashGuide();
  }

  /**
   * change application language
   * @param lang language to change to
   */
  changeLanguage(lang: Language): void {
    this.config.currentLang.value = lang;
    this.footerLogic.changeLanguage(lang);
  }

  /**
   * call staff functionality
   */
  async callStaff(): Promise<void> {
    await this.footerLogic.callStaff();
  }

  /**
   * open allergen dialog
   */
  openAllergen(): void {
    this.footerLogic.openAllergen();
  }

  /**
   * close allergen dialog
   */
  closeAllergen(): void {
    this.footerLogic.closeAllergen();
  }

  /**
   * navigate to category page
   */
  goToCategoryPage(): void {
    GlobalEvent.Instance.goToCategoryPage();
  }
}