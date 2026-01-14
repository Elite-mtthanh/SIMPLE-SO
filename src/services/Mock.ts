import { IService } from './IService';
import SplashData from '@/dummy-data/SplashConfig.json';
import DictData from '@/dummy-data/Dict.json';

export class Mock implements IService {
  constructor() {
  }

  GetConfig(): string {
    return JSON.stringify({
      env: 'mock',
    });
  }

  GetSplashGuide(): string {
    return JSON.stringify(SplashData);
  }

  GetString(key: string): string {
    const info = (DictData as any)[key] ?? null;
    return JSON.stringify(info);
  }

  async callStaff(): Promise<boolean> {
    // mock delay
    await new Promise(r => setTimeout(r, 800));

    // mock success / fail (80% success)
    return Math.random() > 0.2;
  }
}
