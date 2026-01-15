import { AppConfig } from "@/model/AppConfig";
import { SplashConfig } from "@/model/Splash";
import { ServiceIF } from "@/services/ServiceIF";
import { Language } from '@/model/Splash';
import { DialogArgs, DialogButtonId, DialogMessageType } from "@/model/Dialog";
import { GlobalEvent } from "../common/GlobalEvent";

export class StartPageLogic {
  splashData?: SplashConfig;

  readonly languageOptions = [
    { label: '日本語', value: Language.JA },
    { label: '中文', value: Language.ZH },
    { label: 'English', value: Language.EN }
  ];

  async activate(): Promise<void> {
    this.splashData = ServiceIF.getSplashGuide();
    console.log(this.splashData)
  }

  changeLanguage(lang: number) {
    AppConfig.Instance.langIndex.value = lang;
  }

  async callStaff(): Promise<void> {
    const confirmDialog = new DialogArgs();
    confirmDialog.title = '';
    confirmDialog.message = 'CALL_STAFF_CONFIRM_MESSAGE';
    confirmDialog.buttons = [
      { id: DialogButtonId.Cancel, text: 'CANCEL_BUTTON' },
      { id: DialogButtonId.Confirm, text: 'AGREE_BUTTON' },
    ];

    const result = await GlobalEvent.Instance.showCommonDialog(confirmDialog);

    if (result !== DialogButtonId.Confirm) return;

    try {
      await ServiceIF.callStaff();

      const successDialog = new DialogArgs();
      successDialog.title = '';
      successDialog.message = 'CALL_STAFF_SUCCESS_MESSAGE';
      successDialog.messageType = DialogMessageType.Success;
      successDialog.buttons = [
        { id: DialogButtonId.Ok, text: 'CLOSE_BUTTON' },
      ];

      await GlobalEvent.Instance.showCommonDialog(successDialog);

    } catch (e) {
      const errorDialog = new DialogArgs();
      errorDialog.title = '';
      errorDialog.message = 'CALL_STAFF_ERROR_MESSAGE';
      errorDialog.messageType = DialogMessageType.Error;
      errorDialog.buttons = [
        { id: DialogButtonId.Ok, text: 'CLOSE_BUTTON' },
      ];

      await GlobalEvent.Instance.showCommonDialog(errorDialog);
    }
  }

  deactivate(): void {
    //
  }
}
