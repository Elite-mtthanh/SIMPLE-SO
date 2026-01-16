import { DialogButtonId, DialogMessageType } from "./Enums";

export class ButtonInfo {
  id: DialogButtonId;
  text: string;

  constructor(id: DialogButtonId, text: string) {
    this.id = id;
    this.text = text;
  }
}

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