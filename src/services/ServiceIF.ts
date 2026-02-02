import { SplashConfig } from '@/model/Splash';
import { IService } from './IService';
import { Mock } from './Mock';
import { Dict } from '@/model/Dict';
import { normalizeDictRow } from '@/util/DictNormalizerUtil';
import { Menu, MenuSelect, StockoutMenu } from '@/model/Menu';

declare let SVS: IService;

export class ServiceIF {
  private static TIF: IService = typeof SVS === 'undefined' ? new Mock() : SVS;

  static enableMock(): void {
    this.TIF = new Mock();
  }
  static getConfig(): any {
    return JSON.parse(this.TIF.GetConfig());
  }
  static getSplashGuide(): SplashConfig {
    return JSON.parse(this.TIF.GetSplashGuide());
  }
  static getDict(key: string): Dict | null {
    const raw = this.TIF.GetDictRaw(key);
    if (!raw || raw === 'null') return null;

    const row = JSON.parse(raw);
    return normalizeDictRow(row);
  }

  static callStaff(): Promise<boolean> {
    return this.TIF.CallStaff();
  }

  static setCallStaffTestResult(value: true | false): void {
    if (this.TIF instanceof Mock) {
      this.TIF.SetCallStaffResult(value);
    }
  }
  static getAllMenus(): Menu[] {
    if (!this.TIF.GetMenuList) return [];
    return this.TIF.GetMenuList();
  }

  static getAllMenuSelects(): MenuSelect[] {
    if (!this.TIF.GetMenuSelect) return [];
    return this.TIF.GetMenuSelect();
  }

  static getStockoutList(): StockoutMenu[] {
    if (!this.TIF.GetStockoutList) return [];
    return this.TIF.GetStockoutList();
  }
}
