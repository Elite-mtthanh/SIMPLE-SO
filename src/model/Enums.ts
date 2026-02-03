/**
 * enumeration for dialog button identifiers
 */
export enum DialogButtonId {
  Cancel = 0,
  Confirm = 1,
  Ok = 2,
}

/** 
 * enumeration for dialog message types
 */
export enum DialogMessageType {
  Default = 'default',
  Success = 'success',
  Error = 'error',
}
/**
 * enumeration for footer modes
 */
export enum FooterMode {
  Splash = 'splash',
  Category = 'category',
  Menu = 'menu',
}

/**
 * enumeration for splash types
 */
export enum SplashType {
  GUIDE = 1,
  SLIDESHOW = 2
}

/** 
 * enumeration for supported languages
 */
export enum Language {
  JA = 'ja',
  ZH = 'zh',
  EN = 'en',
}

/** 
 * enumeration for menu types
 */
export enum MenuType {
  Category = 'category',
  Menu = 'menu',
}

/** 
 * enumeration for menu select types
 */
export enum MenuSelectType {
  Size = 'size',
  Topping = 'topping',
}

/**
 * enumeration for current page stack types
 */
export enum currentPageStackType {
  New = 1,
  Back = 2,
  SingleTop = 3,
  NoHistory = 4,
}
