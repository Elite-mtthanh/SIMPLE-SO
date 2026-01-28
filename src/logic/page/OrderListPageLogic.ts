import { ref, watch } from 'vue';
import { CartItem } from '@/model/Menu';
import { CartStorage } from '@/storage/CartStorage';
import { GlobalEvent } from '../common/GlobalEvent';

export class CartLogic {
  items = ref<CartItem[]>([]);

  constructor() {
    this.getOrderList();
    
    GlobalEvent.Instance.on('cart-updated', () => {
      this.getOrderList();
    });
  }

  getOrderList(): void {
    this.items.value = CartStorage.getCart();
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
}
