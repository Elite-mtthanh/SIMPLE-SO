export enum DialogButtonId {
    Cancel = 0,
    Confirm = 1,
    Ok = 2,
}

export class ButtonInfo {
    id: DialogButtonId;
    text: string;

    constructor(id: number, text: string) {
        this.id = id;
        this.text = text;
    }
}

export class DialogArgs {
    title = '';
    message = '';
    buttons: ButtonInfo[] = [];
    resolve: Function | null = null;
    messageType: DialogMessageType = DialogMessageType.Default;

    constructor(init?: Partial<DialogArgs>) {
        Object.assign(this, init);
    }
}

export enum DialogMessageType {
    Default = 'default',
    Success = 'success',
    Error = 'error',
}