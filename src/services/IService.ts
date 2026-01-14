export interface IService {
  GetConfig(): string;
  GetSplashGuide(): string;
  GetString(key: string): string;

  callStaff(): Promise<boolean>;
}
