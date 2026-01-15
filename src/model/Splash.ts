import { Language, SplashType } from "./enums";

export interface SplashConfig {
  deskNumber: string;
  isShowDeskNumber: boolean;
  splashType: SplashType;
  languageList: Language;
  isShowAllergen: boolean;
}
