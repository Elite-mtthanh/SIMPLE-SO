import { IService } from './IService';
import SplashData from '@/dummy-data/Config.json';
import DictData from '@/dummy-data/Dict.json';

export class Mock implements IService {
  private isCallStaffSuccess: number | null = null;
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

  setCallStaffResult(value: 0 | 1) {
    this.isCallStaffSuccess = value;
  }

  async CallStaff(): Promise<number> {
    await new Promise(r => setTimeout(r, 3000));

    if (this.isCallStaffSuccess !== null) {
      return this.isCallStaffSuccess;
    }

    return Math.random() > 0.5 ? 1 : 0;
  }
}
