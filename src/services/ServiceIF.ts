import { SplashConfig } from '@/model/Splash';
import { IService } from './IService';
import { Mock } from './Mock';
import { Dict } from '@/model/Dict';
import { normalizeDictRow } from '@/util/DictNormalizer';
import { Menu, MenuSelect, soldOutMenu } from '@/model/Menu';

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

  static callStaff(): Promise<number> {
    return this.TIF.CallStaff();
  }

  static setCallStaffTestResult(value: 0 | 1): void {
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

  static getStockoutList(): soldOutMenu[] {
    if (!this.TIF.GetStockoutList) return [];
    return this.TIF.GetStockoutList();
  }
}
