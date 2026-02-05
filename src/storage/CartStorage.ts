import { CartItem } from "@/model/Menu";
import { GlobalEvent } from "@/logic/common/GlobalEvent";
import { getMenuName, getMenuSelectName, normalizeTextWithLineLimit } from "@/util/DictNormalizerUtil";
import { DataPool } from "@/model/DataPool";
import { AppConfig } from "@/model/AppConfig";

const CART_KEY = 'ORDER_CART';
const MAX_QUANTITY_PER_MENU = 10;

export class CartStorage {
  /**
   * Check if two toppings arrays are the same
   * @param a First toppings array
   * @param b Second toppings array
   * @returns true if both arrays contain the same toppings
   */
  private static isSameToppings(
    a: CartItem['toppings'],
    b: CartItem['toppings']
  ): boolean {
    if (a.length !== b.length) return false;

    const aIds = a.map(t => t.selectCd).sort();
    const bIds = b.map(t => t.selectCd).sort();

    return aIds.every((id, index) => id === bIds[index]);
  }

  /**
   * Get cart items from local storage
   * @returns Array of cart items
   */
  static getCart(): CartItem[] {
    const raw = localStorage.getItem(CART_KEY);
    const items: CartItem[] = raw ? JSON.parse(raw) : [];

    const lang = AppConfig.Instance.currentLang.value;

    return items.map(item => {
      const menu = DataPool.Instance.getMenuByCd(item.menuCd);

      const toppings = Array.isArray(item.toppings) ? item.toppings : [];

      return {
        ...item,
        name: menu
          ? normalizeTextWithLineLimit(getMenuName(menu, lang), 1)
          : '',

        toppings: toppings.map(t => {
          const menuSelect = DataPool.Instance.allSelects.find(
            s => s.select_cd === t.selectCd
          );
          return {
            ...t,
            name: menuSelect
              ? normalizeTextWithLineLimit(
                getMenuSelectName(menuSelect, lang),
                2
              )
              : '',
          };
        }),
      };
    });
  }


  /**
   * Get total quantity of a specific menu item in cart (regardless of size/topping)
   * @param menuCd Menu code to check
   * @returns Total quantity in cart for this menu
   */
  static getMenuQuantityInCart(menuCd: string): number {
    const cart = this.getCart();
    const matchingItems = cart.filter(c => c.menuCd === menuCd);
    return matchingItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Get maximum quantity that can be added for a menu item
   * @param menuCd Menu code to check
   * @param excludeIndex Index to exclude from calculation (for edit mode)
   * @returns Maximum quantity that can be added
   */
  static getMaxAddableQuantity(
    menuCd: string,
    excludeIndex: number = -1
  ): number {
    const cart = this.getCart();
    const matchingItems = cart
      .map((item, index) => ({ item, index }))
      .filter(({ item, index }) => item.menuCd === menuCd && index !== excludeIndex);

    const currentQuantity = matchingItems.reduce((sum, { item }) => sum + item.quantity, 0);
    return Math.max(0, MAX_QUANTITY_PER_MENU - currentQuantity);
  }

  static saveCart(cart: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  static addItem(item: CartItem): void {
    const cart = this.getCart();

    const totalMenuQuantity = this.getMenuQuantityInCart(item.menuCd);
    const maxAddable = MAX_QUANTITY_PER_MENU - totalMenuQuantity;

    if (maxAddable <= 0) {
      return;
    }

    const quantityToAdd = Math.min(item.quantity, maxAddable);
    const pricePerItem = item.total / item.quantity;

    const existing = cart.find(c =>
      c.menuCd === item.menuCd &&
      (c.size?.selectCd ?? null) === (item.size?.selectCd ?? null) &&
      this.isSameToppings(c.toppings, item.toppings)
    );

    if (existing) {
      existing.quantity += quantityToAdd;
      existing.total += pricePerItem * quantityToAdd;
    } else {
      cart.push({
        ...item,
        quantity: quantityToAdd,
        total: pricePerItem * quantityToAdd,
      });
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
      const maxAddable = this.getMaxAddableQuantity(newItem.menuCd, index);

      const cappedQuantity = Math.min(newItem.quantity, maxAddable);
      const pricePerItem = newItem.total / newItem.quantity;

      cart[index] = {
        ...newItem,
        quantity: cappedQuantity,
        total: pricePerItem * cappedQuantity,
      };

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

  /**
   * Move an item to the top of the cart
   * @param index Index of the item to move to top
   */
  static moveToTop(index: number): void {
    const cart = this.getCart();

    if (index > 0 && index < cart.length) {
      const item = cart.splice(index, 1)[0];
      cart.unshift(item);
      this.saveCart(cart);
      GlobalEvent.Instance.emitEvent('cart-updated');
    }
  }
}
