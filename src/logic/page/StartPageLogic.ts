import { ref, Ref } from 'vue';
import { SplashConfig } from '@/model/Splash';
import { ServiceIF } from '@/services/ServiceIF';
import { Language } from '@/model/Enums';
import { GlobalEvent } from '../common/GlobalEvent';
import { FooterLogic } from '../common/FooterLogic';

export class StartPageLogic {
  private footerLogic = new FooterLogic();

  splashData: Ref<SplashConfig | null> = ref(null);
  currentLang: Ref<Language> = ref(Language.JA);
  showAllergen: Ref<boolean> = ref(false);

  get languageOptions() {
    return this.footerLogic.languageOptions;
  }

  async activate(): Promise<void> {
    this.splashData.value = ServiceIF.getSplashGuide();
  }

  changeLanguage(lang: Language): void {
    this.currentLang.value = lang;
    this.footerLogic.changeLanguage(lang);
  }

  async callStaff(): Promise<void> {
    await this.footerLogic.callStaff();
  }

  openAllergen(): void {
    this.showAllergen.value = true;
  }

  closeAllergen(): void {
    this.showAllergen.value = false;
  }

  goToCategoryPage(): void {
    GlobalEvent.Instance.goToCategoryPage();
  }

  deactivate(): void {
    //
  }
}
