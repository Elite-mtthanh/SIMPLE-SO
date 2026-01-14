export interface SplashConfig {
    deskNumber: string;
    isShowDeskNumber: boolean;
    splashType: SplashType;
    languageList: Language;
    isShowAllergen: boolean;
}

export enum SplashType {
    GUIDE = 1,        
    SLIDESHOW = 2  
}

export enum Language {
    JA = 0,
    ZH = 1, 
    EN = 2  
}


