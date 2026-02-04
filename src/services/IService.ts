import { Menu, MenuSelect, StockoutMenu, StockoutSize } from "@/model/Menu";

export interface IService {
  GetConfig(): string;
  GetSplashGuide(): string;
  GetDictRaw(key: string): string;
  CallStaff(): Promise<boolean>;

  GetMenuList(): Menu[];
  GetMenuSelect(): MenuSelect[];
  GetStockoutList(): StockoutMenu[];
  GetStockoutSizeList(): StockoutSize[];
}
