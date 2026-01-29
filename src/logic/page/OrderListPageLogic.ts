import { ref, watch } from 'vue';
import { CartItem } from '@/model/Menu';
import { CartStorage } from '@/storage/CartStorage';
import { GlobalEvent } from '../common/GlobalEvent';
import { DialogArgs } from '@/model/Dialog';
import { DialogButtonId, DialogMessageType } from '@/model/Enums';

export class CartLogic {
  items = ref<CartItem[]>([]);

  constructor() {
    this.getOrderList();

    GlobalEvent.Instance.on('cart-updated', () => {
      this.getOrderList();
      this.checkCartEmpty();
    });

    watch(
      () => this.items.value.length,
      (newLength) => {
        if (newLength === 0) {
          this.navigateToCategoryList();
        }
      }
    );
  }

  getOrderList(): void {
    this.items.value = CartStorage.getCart();
  }

  /**
   * Check if cart is empty and navigate to category list
   */
  private checkCartEmpty(): void {
    if (this.items.value.length === 0) {
      this.navigateToCategoryList();
    }
  }

  /**
   * Navigate back to category list page
   */
  private navigateToCategoryList(): void {
    GlobalEvent.Instance.goToCategoryPage();
  }

  get totalQuantity(): number {
    return this.items.value.reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalPrice(): number {
    return this.items.value.reduce((sum, i) => sum + i.total, 0);
  }

  get totalItemCount(): number {
    return this.items.value.reduce((sum, i) => sum + i.quantity, 0);
  }

  remove(index: number): void {
    this.items.value.splice(index, 1);
    CartStorage.saveCart(this.items.value);
    GlobalEvent.Instance.emitEvent('cart-updated');
  }

  clear(): void {
    this.items.value = [];
    CartStorage.clear();
    GlobalEvent.Instance.emitEvent('cart-updated');
  }

  async callStaff(): Promise<void> {
    const confirmDialog = new DialogArgs();
    confirmDialog.message = 'ORDER_CONFIRM_MESSAGE';
    confirmDialog.comment = 'ORDER_CONFIRM_COMMENT';
    confirmDialog.messageType = DialogMessageType.Default;
    confirmDialog.buttons = [
      { id: DialogButtonId.Cancel, text: 'CANCEL_BUTTON' },
      { id: DialogButtonId.Confirm, text: 'AGREE_BUTTON' },
    ];

    await GlobalEvent.Instance.showCommonDialog(confirmDialog);
  }
}
