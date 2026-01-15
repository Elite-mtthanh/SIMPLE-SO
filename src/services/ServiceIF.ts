import { SplashConfig } from '@/model/Splash';
import { IService } from './IService';
import { Mock } from './Mock';
import { Dict } from '@/model/Dict';

declare let SVS: IService;

export class ServiceIF {
  private static TIF: IService = typeof SVS == 'undefined' ? new Mock() : SVS;

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
    return JSON.parse(this.TIF.GetString(key));
  }
  static CallStaff(): Promise<number> {
    return this.TIF.CallStaff();
  }

  static setCallStaffTestResult(value: 0 | 1): void {
    if (this.TIF instanceof Mock) {
      this.TIF.setCallStaffResult(value);
    }
  }
}
