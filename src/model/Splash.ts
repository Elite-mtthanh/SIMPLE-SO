import { Language, SplashType } from "./Enums";

export interface SplashConfig {
  deskNumber: string;
  isShowDeskNumber: boolean;
  splashType: SplashType;
  languageList: Language;
  isShowAllergen: boolean;
}
