import { ref, watch } from 'vue';
import { CartItem } from '@/model/Menu';
import { CartStorage } from '@/storage/CartStorage';
import { GlobalEvent } from '../common/GlobalEvent';
import { DialogArgs } from '@/model/Dialog';
import { DialogButtonId, DialogMessageType } from '@/model/Enums';
import { PageStack } from '@/model/PageStack';
import { AppConfig } from '@/model/AppConfig';

export class OrderListPageLogic {
  /** list of cart items */
  public items = ref<CartItem[]>([]);
  /** item currently being edited */
  public editingItem = ref<CartItem | null>(null);
  /** index of item being edited */
  public editingIndex = ref<number>(-1);

  constructor() {
    this.syncCart();

    GlobalEvent.Instance.on('cart-updated', () => {
      this.syncCart();
      this.autoNavigateIfEmpty();
    });

    watch(
      () => this.items.value.length,
      (len) => {
        if (len === 0 && this.isOnOrderListPage()) {
          this.navigateToCategoryList();
        }
      }
    );

    watch(
      () => AppConfig.Instance.currentLang.value,
      () => {
        this.syncCart();
      }
    );
  }

  /**
   * only navigate to category when cart empty if currently on OrderListPage
   * (avoid navigating when clearing cart from OrderResultPage after success)
   */
  private isOnOrderListPage(): boolean {
    return PageStack.Instance.currentPageName.value === 'OrderListPage';
  }

  /** sync items from CartStorage */
  private syncCart(): void {
    this.items.value = CartStorage.getCart();
  }

  /**
   * open edit dialog for cart item
   * @param item cart item to edit
   * @param index index of item in list
   */
  openEdit(item: CartItem, index: number): void {
    this.editingItem.value = item;
    this.editingIndex.value = index;
  }

  /** close edit dialog and clear editing state */
  closeEdit(): void {
    this.editingItem.value = null;
    this.editingIndex.value = -1;
  }

  /** 
   * handle confirm from edit dialog: close, move item to top, and sync cart 
   */
  handleEditConfirm(): void {
    const index = this.editingIndex.value;
    this.closeEdit();
    if (index >= 0) {
      CartStorage.moveToTop(index);
    }
    this.syncCart();
  }


  /** navigate to category list when cart is empty (only when on OrderListPage) */
  private autoNavigateIfEmpty(): void {
    if (this.items.value.length === 0 && this.isOnOrderListPage()) {
      this.navigateToCategoryList();
    }
  }

  /** navigate to category list page */
  private navigateToCategoryList(): void {
    GlobalEvent.Instance.goToCategoryPage();
  }

  /** back to category page */
  backToPreviousPage(): void {
    GlobalEvent.Instance.backToPreviousPage();
  }

  /** total quantity of all cart items */
  get totalQuantity(): number {
    return Math.min(
      this.items.value.reduce((sum, i) => sum + i.quantity, 0),
      99
    );
  }

  /** total price of all cart items */
  get totalPrice(): number {
    return this.items.value.reduce((sum, i) => sum + i.total, 0);
  }

  /**
   * show order confirm dialog and navigate to result page on confirm
   */
  async confirmOrder(): Promise<void> {
    const dialog = new DialogArgs();
    dialog.message = 'ORDER_CONFIRM_MESSAGE';
    dialog.comment = 'ORDER_CONFIRM_COMMENT';
    dialog.messageType = DialogMessageType.Default;
    dialog.buttons = [
      { id: DialogButtonId.Cancel, text: 'CANCEL_BUTTON' },
      { id: DialogButtonId.Confirm, text: 'AGREE_BUTTON' },
    ];

    const result = await GlobalEvent.Instance.showCommonDialog(dialog);
    if (result !== DialogButtonId.Confirm) return;

    // const success = Math.random() < 0.5;
    const success = true;
    GlobalEvent.Instance.goToOrderResultPage({ success });
  }
}
