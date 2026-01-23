import { Menu, MenuSelect } from "@/model/Menu";

export interface IService {
  GetConfig(): string;
  GetSplashGuide(): string;
  GetDictRaw(key: string): string;
  CallStaff(): Promise<number>;

  GetMenuList(): Menu[];
  GetMenuSelect(): MenuSelect[];
}
