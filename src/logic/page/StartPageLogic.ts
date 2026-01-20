import { SplashConfig } from "@/model/Splash";
import { ServiceIF } from "@/services/ServiceIF";
import { Language } from "@/model/Enums";
import { GlobalEvent } from "../common/GlobalEvent";
import { FooterLogic } from "../common/FooterLogic";

export class StartPageLogic {
  private footerLogic = new FooterLogic();
  
  splashData?: SplashConfig;

  get languageOptions() {
    return this.footerLogic.languageOptions;
  }

  async activate(): Promise<void> {
    this.splashData = ServiceIF.getSplashGuide();
    console.log(this.splashData)
  }

  changeLanguage(lang: Language): void {
    this.footerLogic.changeLanguage(lang);
  }

  async callStaff(): Promise<void> {
    await this.footerLogic.callStaff();
  }

  async goToCategoryPage(): Promise<void> {
    GlobalEvent.Instance.goToCategoryPage();
  }

  deactivate(): void {
    //
  }
}
