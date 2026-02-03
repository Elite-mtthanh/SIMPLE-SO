import { Language, SplashType } from "./Enums";

/** 
 * splash configuration interface
*/
export interface SplashConfig {
  deskNumber: string;
  isShowDeskNumber: boolean;
  splashType: SplashType;
  languageList: Language;
  isShowAllergen: boolean;
}
