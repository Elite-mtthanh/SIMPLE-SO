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

  splashData: Ref<SplashConfig | null> = ref(null);

  get currentLang(): Ref<Language> {
    return this.config.currentLang;
  }

  get showAllergen(): Ref<boolean> {
    return this.footerLogic.showAllergen;
  }

  get languageOptions() {
    return this.footerLogic.languageOptions;
  }

  async activate(): Promise<void> {
    this.splashData.value = ServiceIF.getSplashGuide();
  }

  changeLanguage(lang: Language): void {
    this.config.currentLang.value = lang;
    this.footerLogic.changeLanguage(lang);
  }

  async callStaff(): Promise<void> {
    await this.footerLogic.callStaff();
  }

  openAllergen(): void {
    this.footerLogic.openAllergen();
  }

  closeAllergen(): void {
    this.footerLogic.closeAllergen();
  }

  goToCategoryPage(): void {
    GlobalEvent.Instance.goToCategoryPage();
  }
}