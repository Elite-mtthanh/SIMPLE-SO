import { IService } from './IService';
import SplashData from '@/dummy-data/Config.json';
import DictData from '@/dummy-data/Dict.json';
import Menus from '@/dummy-data/menus.json';
import Selects from '@/dummy-data/menu_selects.json';
import { Menu, MenuSelect } from '@/model/Menu';

export class Mock implements IService {
  private isCallStaffSuccess: number | null = null;

  GetConfig(): string {
    return JSON.stringify({ env: 'mock' });
  }

  GetSplashGuide(): string {
    return JSON.stringify(SplashData);
  }

  SetCallStaffResult(value: 0 | 1) {
    this.isCallStaffSuccess = value;
  }

  GetDictRaw(key: string): string {
    const row = (DictData as any[]).find(d => d.key_name === key);
    if (!row) return 'null';

    return JSON.stringify(row);
  }

  async CallStaff(): Promise<number> {
    await new Promise(r => setTimeout(r, 3000));
    return this.isCallStaffSuccess ?? (Math.random() > 0.5 ? 1 : 0);
  }

  GetMenuList(): Menu[] {
    return Menus as unknown as Menu[];
  }

  GetMenuSelect(): MenuSelect[] {
    return Selects as unknown as MenuSelect[];
  }
}
