import { CartItem } from "@/model/Menu";
import { GlobalEvent } from "@/logic/common/GlobalEvent";
import { getMenuSelectName } from "@/util/DictNormalizerUtil";

const CART_KEY = 'ORDER_CART';
const MAX_QUANTITY_PER_MENU = 10;

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

  /**
   * Get total quantity of a specific menu item in cart
   * @param menuCd Menu code to check
   * @param size Selected size (optional)
   * @param toppings Selected toppings
   * @returns Total quantity in cart
   */
  static getMenuQuantityInCart(
    menuCd: string,
    size: CartItem['size'] | null,
    toppings: CartItem['toppings']
  ): number {
    const cart = this.getCart();

    const matchingItems = cart.filter(c =>
      c.menuCd === menuCd &&
      (c.size?.selectCd ?? null) === (size?.selectCd ?? null) &&
      this.isSameToppings(c.toppings, toppings)
    );

    return matchingItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Get maximum quantity that can be added for a menu item
   * @param menuCd Menu code to check
   * @param size Selected size (optional)
   * @param toppings Selected toppings
   * @returns Maximum quantity that can be added
   */
  static getMaxAddableQuantity(
    menuCd: string,
    size: CartItem['size'] | null,
    toppings: CartItem['toppings']
  ): number {
    const currentQuantity = this.getMenuQuantityInCart(menuCd, size, toppings);
    return Math.max(0, MAX_QUANTITY_PER_MENU - currentQuantity);
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
      // Check if adding would exceed max quantity
      const newQuantity = existing.quantity + item.quantity;
      if (newQuantity > MAX_QUANTITY_PER_MENU) {
        existing.quantity = MAX_QUANTITY_PER_MENU;
        // Recalculate total based on capped quantity
        const pricePerItem = item.total / item.quantity;
        existing.total = pricePerItem * MAX_QUANTITY_PER_MENU;
      } else {
        existing.quantity = newQuantity;
        existing.total += item.total;
      }
    } else {
      // Cap quantity if it exceeds max
      if (item.quantity > MAX_QUANTITY_PER_MENU) {
        item.quantity = MAX_QUANTITY_PER_MENU;
        const pricePerItem = item.total / item.quantity;
        item.total = pricePerItem * MAX_QUANTITY_PER_MENU;
      }
      cart.push(item);
    }

    this.saveCart(cart);
    GlobalEvent.Instance.emitEvent('cart-updated');
  }

  /**
   * Update an existing cart item by index
   * @param index Index of the item to update
   * @param newItem New item data
   */
  static updateItem(index: number, newItem: CartItem): void {
    const cart = this.getCart();

    if (index >= 0 && index < cart.length) {
      if (newItem.quantity > MAX_QUANTITY_PER_MENU) {
        newItem.quantity = MAX_QUANTITY_PER_MENU;
        const pricePerItem = newItem.total / newItem.quantity;
        newItem.total = pricePerItem * MAX_QUANTITY_PER_MENU;
      }

      cart[index] = newItem;
      this.saveCart(cart);
      GlobalEvent.Instance.emitEvent('cart-updated');
    }
  }

  /**
   * Remove an item from cart by index
   * @param index Index of the item to remove
   */
  static removeItem(index: number): void {
    const cart = this.getCart();

    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      this.saveCart(cart);
      GlobalEvent.Instance.emitEvent('cart-updated');
    }
  }

  static clear(): void {
    localStorage.removeItem(CART_KEY);
    GlobalEvent.Instance.emitEvent('cart-updated');
  }

  /**
   * Check if cart is empty
   * @returns true if cart is empty
   */
  static isEmpty(): boolean {
    const cart = this.getCart();
    return cart.length === 0;
  }
}
