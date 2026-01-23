import { ref, Ref } from 'vue';
import { AppConfig } from '../../model/AppConfig';
import { Language, DialogButtonId, DialogMessageType } from '../../model/Enums';
import { ServiceIF } from '../../services/ServiceIF';
import { DialogArgs } from '../../model/Dialog';
import { GlobalEvent } from './GlobalEvent';
import bellIcon from '../../assets/Image/icon/bell-dialog-icon.png';

export class FooterLogic {
  showAllergen: Ref<boolean> = ref(false);

  readonly languageOptions = [
    { label: '日本語', value: Language.JA },
    { label: '中文', value: Language.ZH },
    { label: 'English', value: Language.EN }
  ];

  changeLanguage(lang: Language): void {
    AppConfig.Instance.currentLang.value = lang;
  }

  openAllergen(): void {
    this.showAllergen.value = true;
  }

  closeAllergen(): void {
    this.showAllergen.value = false;
  }

  async callStaff(): Promise<void> {
    const confirmDialog = new DialogArgs();
    confirmDialog.title = 'CALL_STAFF_CONFIRM_MESSAGE';
    confirmDialog.iconButton = bellIcon;
    confirmDialog.message = '';
    confirmDialog.messageType = DialogMessageType.Error;
    confirmDialog.buttons = [
      { id: DialogButtonId.Cancel, text: 'CANCEL_BUTTON' },
      { id: DialogButtonId.Confirm, text: 'AGREE_BUTTON' },
    ];

    const result = await GlobalEvent.Instance.showCommonDialog(confirmDialog);
    if (result !== DialogButtonId.Confirm) return;

    const isCallStaffSuccess = await ServiceIF.callStaff();

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
}
