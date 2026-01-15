import { AppConfig } from "@/model/AppConfig";
import { SplashConfig } from "@/model/Splash";
import { ServiceIF } from "@/services/ServiceIF";
import { DialogArgs } from "@/model/Dialog";
import { DialogButtonId, DialogMessageType, Language } from "@/model/enums";
import { GlobalEvent } from "../common/GlobalEvent";
import bellIcon from '@/assets/Image/icon/bell-dialog-icon.png';

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

  changeLanguage(lang: Language) {
    AppConfig.Instance.currentLang.value = lang;
  }

  async callStaff(): Promise<void> {
    const confirmDialog = new DialogArgs();
    confirmDialog.title = '';
    confirmDialog.iconButton = bellIcon;
    confirmDialog.message = 'CALL_STAFF_CONFIRM_MESSAGE';
    confirmDialog.messageType = DialogMessageType.Error;
    confirmDialog.buttons = [
      { id: DialogButtonId.Cancel, text: 'CANCEL_BUTTON' },
      { id: DialogButtonId.Confirm, text: 'AGREE_BUTTON' },
    ];

    const result = await GlobalEvent.Instance.showCommonDialog(confirmDialog);
    if (result !== DialogButtonId.Confirm) return;

    const isCallStaffSuccess = await ServiceIF.CallStaff();

    const resultDialog = new DialogArgs();
    resultDialog.title = '';

    if (isCallStaffSuccess === 1) {
      resultDialog.message = 'CALL_STAFF_SUCCESS_MESSAGE';
      resultDialog.comment = 'CALL_STAFF_SUCCESSE_COMMENT';
      resultDialog.messageType = DialogMessageType.Success;
    } else {
      resultDialog.message = 'CALL_STAFF_ERROR_MESSAGE';
      resultDialog.comment = 'CALL_STAFF_ERROR_COMMENT';
      resultDialog.messageType = DialogMessageType.Error;
    }

    resultDialog.buttons = [
      { id: DialogButtonId.Ok, text: 'CLOSE_BUTTON' },
    ];

    await GlobalEvent.Instance.showCommonDialog(resultDialog);
  }

  deactivate(): void {
    //
  }
}
