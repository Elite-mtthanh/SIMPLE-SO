import { IService } from './IService';
import ConfigData from '@/dummy-data/Config.json';
import StockOutMenuConfig from '@/dummy-data/Stockout.json';
import StockoutSizeConfig from '@/dummy-data/StockoutSize.json';
import DictData from '@/dummy-data/Dict.json';
import Menus from '@/dummy-data/Menus.json';
import Selects from '@/dummy-data/Menu_selects.json';
import { Menu, MenuSelect, StockoutMenu, StockoutSize } from '@/model/Menu';

export class Mock implements IService {
  private isCallStaffSuccess: boolean | null = null;

  /** 
   * get config
   * retrieves application configuration from Config.json
   * @returns string - stringified config data containing languageList, deskNumber, etc.
   */
  GetConfig(): string {
    return JSON.stringify(ConfigData);
  }

  /** 
   * get splash guide data
   * @returns string - stringified splash guide data
   */
  GetSplashGuide(): string {
    return JSON.stringify(ConfigData);
  }

  /**
   * Set the result for CallStaff
   * @param value - true to simulate success, false to simulate failure
   */
  SetCallStaffResult(value: boolean) {
    this.isCallStaffSuccess = value;
  }

  /**
   * Retrieves data from dictionary by key
   * @param key - key to search in dictionary
   * @returns stringified dictionary data, or 'null' if not found
   */
  GetDictRaw(key: string): string {
    const row = (DictData as any[]).find(d => d.key_name === key);
    if (!row) return 'null';
    return JSON.stringify(row);
  }

  /**
   * call staff from their table
   * @returns Promise<boolean> - promise resolves with true if call succeeds, false if fails
   */
  async CallStaff(): Promise<boolean> {
    await new Promise(r => setTimeout(r, 3000));
    return this.isCallStaffSuccess ?? true;
  }

  /**
   * Retrieves menu list data
   * @returns Promise<Menu[]> - a promise that resolves with the menu list data
   */
  GetMenuList(): Menu[] {
    return Menus as unknown as Menu[];
  }

  /**
   * Menu select list contains information about menu options, such as size, topping, etc.
   * @returns MenuSelect[] - an array containing menu select list data
   */
  GetMenuSelect(): MenuSelect[] {
    return Selects as unknown as MenuSelect[];
  }

  /**
   * Retrieves the list of out-of-stock items (stockout)
   * @returns StockoutMenu[] - an array containing out-of-stock items
   */
  GetStockoutList(): StockoutMenu[] {
    return JSON.parse(JSON.stringify(StockOutMenuConfig)) as StockoutMenu[];
  }

  /**
   * Retrieves the list of out-of-stock sizes
   * @returns StockoutSize[] - an array containing out-of-stock sizes
   */
  GetStockoutSizeList(): StockoutSize[] {
    return JSON.parse(JSON.stringify(StockoutSizeConfig)) as StockoutSize[];
  }
}
