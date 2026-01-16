import mitt from 'mitt';
import { PageStackType } from '@/model/PageStack';
import { DialogArgs } from '@/model/Dialog';
import { DialogButtonId } from '@/model/Enums';

export enum EmitEvent {
  ChangeScreen = 'change-screen',
  ShowCommonDialog = 'show-common-dialog',
  HideCommonDialog = 'hide-common-dialog',
  ConfirmDialog = 'confirm-dialog',
}

export class PageArgs {
  public Name: string = '';
  public Type: PageStackType = PageStackType.NoHistory;
  public Data: any = null;
  public Seconds: number = -1;
  public IsForceClose: boolean = false;

  constructor(
    name: string,
    type: PageStackType,
    data: any = null,
    seconds: number = -1,
    isForceClose: boolean = false
  ) {
    this.Name = name;
    this.Type = type;
    this.Data = data;
    this.Seconds = seconds;
    this.IsForceClose = isForceClose;
  }
}

export class GlobalEvent {
  public static Instance: GlobalEvent;

  private readonly eventBus: any;
  private currentPageArgs: PageArgs | null = null;

  constructor() {
    this.eventBus = mitt();
  }

  public static init() {
    if (this.Instance == null) {
      this.Instance = new GlobalEvent();
    }
  }

  public on(event: string | string[], callback: Function): void {
    this.eventBus.on(event, callback);
  }

  public off(event?: string | string[], callback?: Function): void {
    this.eventBus.off(event, callback);
  }

  public emitEvent(event: string, ...args: any[]) {
    this.eventBus.emit(event, ...args);
  }

  public async showCommonDialog(dialogInfo: DialogArgs): Promise<DialogButtonId> {
    return await new Promise<number>((resolve) => {
      dialogInfo.resolve = resolve;
      this.eventBus.emit(EmitEvent.ShowCommonDialog, dialogInfo);
    });
  }

  public dismissCommonDialog(): void {
    this.eventBus.emit(EmitEvent.HideCommonDialog);
  }

  private emitChangeScreen(args: PageArgs) {
    this.currentPageArgs = args;
    this.eventBus.emit(EmitEvent.ChangeScreen, args);
  }


  public showStartPage() {
    this.emitChangeScreen(
      new PageArgs('start-page', PageStackType.NoHistory)
    );
  }

  public goToCategoryPage() {
    this.emitChangeScreen(
      new PageArgs('category-page', PageStackType.NoHistory)
    );
    console.log('Go to category page');
  }
}
