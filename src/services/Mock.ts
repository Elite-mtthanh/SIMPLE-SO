import { IService } from './IService';
import SplashData from '@/dummy-data/Config.json';
import StockOutMenuConfig from '@/dummy-data/Stockout.json';
import DictData from '@/dummy-data/Dict.json';
import Menus from '@/dummy-data/Menus.json';
import Selects from '@/dummy-data/Menu_selects.json';
import { Menu, MenuSelect, StockoutMenu } from '@/model/Menu';

export class Mock implements IService {
  private isCallStaffSuccess: boolean | null = null;

  GetConfig(): string {
    return JSON.stringify({ env: 'mock' });
  }

  GetSplashGuide(): string {
    return JSON.stringify(SplashData);
  }

  SetCallStaffResult(value: true | false) {
    this.isCallStaffSuccess = value;
  }

  GetDictRaw(key: string): string {
    const row = (DictData as any[]).find(d => d.key_name === key);
    if (!row) return 'null';

    return JSON.stringify(row);
  }

  async CallStaff(): Promise<boolean> {
    await new Promise(r => setTimeout(r, 3000));
    return this.isCallStaffSuccess ?? true;
  }

  GetMenuList(): Menu[] {
    return Menus as unknown as Menu[];
  }

  GetMenuSelect(): MenuSelect[] {
    return Selects as unknown as MenuSelect[];
  }

  GetStockoutList(): StockoutMenu[] {
    return JSON.parse(JSON.stringify(StockOutMenuConfig));
  }
}
