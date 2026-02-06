import { EmitEvent, GlobalEvent, PageArgs } from '@/logic/common/GlobalEvent';
import { DialogArgs } from '@/model/Dialog';
import { PageStack, PageStackType } from '@/model/PageStack';
import { computed, ComputedRef, reactive } from 'vue';

export class TopLogic {
  public currentPageName: ComputedRef<string>;
  public currentPageArgs: PageArgs | null = null;
  public readonly commonDialogSettings: {
    isShow: boolean;
    info: DialogArgs | null;
  };
  constructor() {
    this.currentPageName = computed(() => {
      return PageStack.Instance.currentPageName.value;
    });
    this.currentPageArgs = PageStack.Instance.currentPageArgs.value;
    this.commonDialogSettings = reactive({
      isShow: false,
      info: null,
    });
    this.registerEvents();
  }

  private registerEvents(): void {
    GlobalEvent.Instance.on(EmitEvent.ChangeScreen, (page: PageArgs) => {
      this.handleChangeScreen(page.Name, page.Type);
    });

    GlobalEvent.Instance.on(EmitEvent.ShowCommonDialog, (args: DialogArgs) => {
      this.commonDialogSettings.isShow = true;
      this.commonDialogSettings.info = args;
    });

    GlobalEvent.Instance.on(EmitEvent.HideCommonDialog, () => {
      this.commonDialogSettings.isShow = false;
      this.commonDialogSettings.info = null;
    });
  }

  private handleChangeScreen(name: string, type: PageStackType): void {

    if (type === PageStackType.Back) {
      PageStack.Instance.backScreen();
    } else {
      PageStack.Instance.manageStack(name, type);
      if (PageStack.Instance.currentPageName.value != name) {
        PageStack.Instance.changeScreen(name);
      } else {
        // do nothing
      }
    }
  }
}
