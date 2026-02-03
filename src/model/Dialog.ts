import { DialogButtonId, DialogMessageType } from "./Enums";

export class ButtonInfo {
  id: DialogButtonId;
  text: string;

  /**
   * constructor button info
   * @param id button id
   * @param text button display text
   */
  constructor(id: DialogButtonId, text: string) {
    this.id = id;
    this.text = text;
  }
}

/**
* dialog arguments
*/
export class DialogArgs {
  title = '';
  message = '';
  comment = '';
  buttons: ButtonInfo[] = [];
  iconButton = '';
  resolve: Function | null = null;
  messageType: DialogMessageType = DialogMessageType.Default;

  constructor(init?: Partial<DialogArgs>) {
    Object.assign(this, init);
  }
}