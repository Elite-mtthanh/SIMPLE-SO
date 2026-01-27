import { CartItem } from "@/model/Menu";
import { GlobalEvent } from "@/logic/common/GlobalEvent";

const CART_KEY = 'ORDER_CART';

export class CartStorage {
  private static isSameToppings(
    a: CartItem['toppings'],
    b: CartItem['toppings']
  ): boolean {
    if (a.length !== b.length) return false;

    const aIds = a.map(t => t.selectCd).sort();
    const bIds = b.map(t => t.selectCd).sort();

    return aIds.every((id, index) => id === bIds[index]);
  }

  static getCart(): CartItem[] {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static saveCart(cart: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  static addItem(item: CartItem): void {
    const cart = this.getCart();

    const existing = cart.find(c =>
      c.menuCd === item.menuCd &&
      (c.size?.selectCd ?? null) === (item.size?.selectCd ?? null) &&
      this.isSameToppings(c.toppings, item.toppings)
    );

    if (existing) {
      existing.quantity += item.quantity;
      existing.total += item.total;
    } else {
      cart.push(item);
    }

    this.saveCart(cart);
    GlobalEvent.Instance.emitEvent('cart-updated');
  }

  static clear(): void {
    localStorage.removeItem(CART_KEY);
  }
}
