import { SplashConfig } from '@/model/Splash';
import { IService } from './IService';
import { Mock } from './Mock';
import { Dict } from '@/model/Dict';
import { normalizeDictRow } from '@/util/DictNormalizerUtil';
import { Menu, MenuSelect, StockoutMenu } from '@/model/Menu';

declare let SVS: IService;

export class ServiceIF {
  private static TIF: IService = typeof SVS === 'undefined' ? new Mock() : SVS;

  /**
   * enable mock
   * activates mock service mode (used for testing/development)
   * 
   * @returns void
   */
  static enableMock(): void {
    this.TIF = new Mock();
  }

  /**
   * get config
   * retrieves application configuration from service
   * @returns any - object containing app configuration (parsed from JSON)
   */
  static getConfig(): any {
    return JSON.parse(this.TIF.GetConfig());
  }

  /**
   * get splash guide
   * retrieves splash screen and guide pages configuration
   * @returns SplashConfig - object containing splash config info (parsed from JSON)
   */
  static getSplashGuide(): SplashConfig {
    return JSON.parse(this.TIF.GetSplashGuide());
  }

  /**
   * get dict
   * retrieves data from dictionary by key
   * dictionary contains multilingual text and display configurations
   * @param key - key to search in dictionary
   * @returns Dict | null - normalized dict object, or null if not found
   */
  static getDict(key: string): Dict | null {
    const raw = this.TIF.GetDictRaw(key);
    if (!raw || raw === 'null') return null;
    const row = JSON.parse(raw);
    return normalizeDictRow(row);
  }

  /**
   * calls service staff
   * this function allows customers to call staff from their table
   * @returns Promise<boolean> - promise resolves with true if call succeeds, false if fails
   */
  static callStaff(): Promise<boolean> {
    return this.TIF.CallStaff();
  }

  /**
   * sets test result for call staff function (only works in mock mode)
   * this method only works when using mock service,
   * used to test success/failure scenarios of callStaff
   * @param value - true to simulate success, false to simulate failure
   * @returns void
   */
  static setCallStaffTestResult(value: true | false): void {
    if (this.TIF instanceof Mock) {
      this.TIF.SetCallStaffResult(value);
    }
  }

  /**
   * get all menus
   * retrieves list of all menu items
   * @returns Menu[] - array containing all menu items, returns empty array if service doesn't support
   */
  static getAllMenus(): Menu[] {
    if (!this.TIF.GetMenuList) return [];
    return this.TIF.GetMenuList();
  }

  /**
   * get all menu selects
   * retrieves list of menu selections (size, topping, options...)
   * menu select contains information about options available for each menu
   * such as: size (S/M/L), topping (extra cheese, bacon...), etc.
   * @returns MenuSelect[] - array containing menu selects, returns empty array if service doesn't support
   */
  static getAllMenuSelects(): MenuSelect[] {
    if (!this.TIF.GetMenuSelect) return [];
    return this.TIF.GetMenuSelect();
  }

  /**
   * get stockout list
   * retrieves list of out-of-stock items (stockout)
   * this list contains menu items currently out of stock,
   * used to disable or display out-of-stock notification on UI
   * @returns StockoutMenu[] - array containing out-of-stock items, returns empty array if service doesn't support
   */
  static getStockoutList(): StockoutMenu[] {
    if (!this.TIF.GetStockoutList) return [];
    return this.TIF.GetStockoutList();
  }
}