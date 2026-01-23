import { createApp } from 'vue';
import App from '../page/Top.vue';
import { GlobalEvent } from '@/logic/common/GlobalEvent';
import { ServiceIF } from '@/services/ServiceIF';
import { PageStack } from '@/model/PageStack';
import { AppConfig } from '@/model/AppConfig';
import { DataPool } from '@/model/DataPool';

export class BaseMain {
  private app: any | null = null;

  public async setup() {
    if (process.env.NODE_ENV == 'development') {
      ServiceIF.enableMock();
    }
    AppConfig.init();
    DataPool.init();
    GlobalEvent.init();
    PageStack.init();

    this.setupDefault();
    this.requireBusinessLogic();

    this.buildVueComponent();
    this.requireBusinessCSS();
    this.requireBusinessAudio();
  }

  protected buildVueComponent() {
    this.app = createApp(App);
    this.app.mount('#app');
    this.app.config.productionTip = false;
  }

  protected requireBusinessCSS(): void { }

  protected requireBusinessLogic(): void { }

  protected requireBusinessAudio(): void {
    require('@/assets/audio/Basic/click1.mp3');
  }

  private setupDefault(): void {

  }
}
