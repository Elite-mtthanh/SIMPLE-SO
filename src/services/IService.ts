export interface IService {
  GetConfig(): string;
  GetSplashGuide(): string;
  GetDictRaw(key: string): string;
  CallStaff(): Promise<number>;

  GetMenuList?(): string;
  GetMenuSelect?(menuCd: string): string;
}
