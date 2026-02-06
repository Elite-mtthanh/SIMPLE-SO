import { DataPool } from '@/model/DataPool';
import { CartItem, MenuItem, MenuSelect } from '@/model/Menu';
import { AppConfig } from '@/model/AppConfig';
import { getMenuDescription, getMenuName, getMenuSelectName, normalizeTextWithLineLimit } from '@/util/DictNormalizerUtil';
import { CartStorage } from '@/storage/CartStorage';
import { DialogArgs } from '@/model/Dialog';
import { DialogButtonId, DialogMessageType } from '@/model/Enums';
import { GlobalEvent } from '../common/GlobalEvent';

const MAX_QUANTITY_PER_MENU = 10;

export class MenuDetailLogic {
  /** data pool instance */
  private dataPool = DataPool.Instance;

  /** current menu item */
  menu: MenuItem = {} as MenuItem;

  /** raw menu data for reference */
  private rawMenu: any = null;

  /** available size options */
  sizes: MenuSelect[] = [];

  /** available topping options */
  toppings: MenuSelect[] = [];

  /** order quantity */
  quantity: number = 1;

  /** selected size option */
  selectedSize: MenuSelect | null = null;

  /** selected topping options */
  selectedToppings: MenuSelect[] = [];

  /**
   * load menu details by menu code
   * @param menuCd menu code to load
   */
  getMenuDetail(menuCd: string): void {
    const rawMenu = this.dataPool.getMenuByCd(menuCd);
    if (!rawMenu) {
      return;
    }

    this.rawMenu = rawMenu;
    const lang = AppConfig.Instance.currentLang.value;
    console.log('lang:', lang);
    this.quantity = 1;
    this.selectedToppings = [];
    this.selectedSize = null;
    this.sizes = [];
    this.toppings = [];

    this.menu = {
      id: rawMenu.id,
      menu_cd: rawMenu.menu_cd,
      name: normalizeTextWithLineLimit(getMenuName(rawMenu, lang), 2),
      description: normalizeTextWithLineLimit(getMenuDescription(rawMenu, lang), 3),
      price: rawMenu.price,
      imagePath: rawMenu.image_path,
      soldOut: this.dataPool.isStockout(rawMenu.menu_cd),
      hasSelectSize: (!!rawMenu.select_size && rawMenu.select_size !== '0' && rawMenu.select_size !== '') ? '1' : '0',
    };

    if (rawMenu.select_size && rawMenu.select_size !== '0' && rawMenu.select_size !== '') {
      const menuSizes = this.dataPool.getMenuSizes(rawMenu.select_size);
      this.sizes = menuSizes.map(size => ({
        ...size,
        name: getMenuSelectName(size, lang),
        soldOut: this.dataPool.isSizeStockout(size.select_cd),
      }));

      const menuToppings = this.dataPool.getMenuToppings(rawMenu.select_size);
      this.toppings = menuToppings.map(topping => ({
        ...topping,
        name: getMenuSelectName(topping, lang),
      }));

      if (this.sizes.length > 0) {
        const availableSize = this.sizes.find(s => !s.soldOut);
        this.selectedSize = availableSize || null;
      }
    }
  }

  /**
   * toggle topping selection
   * @param topping topping to toggle
   */
  toggleTopping(topping: MenuSelect): void {
    const idx = this.selectedToppings.findIndex(
      (t) => t.select_cd === topping.select_cd
    );

    if (idx >= 0) {
      this.selectedToppings.splice(idx, 1);
    } else {
      this.selectedToppings.push(topping);
    }
  }

  /**
   * check if topping is selected
   * @param topping topping to check
   * @returns true if topping is selected
   */
  isChecked(topping: MenuSelect): boolean {
    return this.selectedToppings.some((t) => t.select_cd === topping.select_cd);
  }

  /**
   * Get maximum quantity that can be ordered
   * @param editIndex Index of item being edited (for edit mode)
   * @returns Maximum quantity considering cart items
   */
  getMaxQuantity(editIndex: number = -1): number {
    const maxAddable = CartStorage.getMaxAddableQuantity(
      this.menu.menu_cd,
      editIndex
    );

    return Math.min(MAX_QUANTITY_PER_MENU, maxAddable);
  }

  /**
   * show over quantity warning dialog
   */
  private async showOverQuantityDialog(): Promise<void> {
    const dialog = new DialogArgs();
    dialog.message = 'OVER_QUANTITY_MESSAGE';
    dialog.comment = '';
    dialog.messageType = DialogMessageType.Error;
    dialog.buttons = [
      { id: DialogButtonId.Confirm, text: 'CLOSE_BUTTON' },
    ];

    await GlobalEvent.Instance.showCommonDialog(dialog);
  }

  /**
   * increase order quantity
   * @param editIndex Index of item being edited (for edit mode), pass -1 when adding new
   * @returns Promise that resolves to true if quantity was increased, false if limit reached
   */
  async increase(editIndex: number = -1): Promise<boolean> {
    const cart = CartStorage.getCart();
    let totalItemsInCart = 0;

    for (let i = 0; i < cart.length; i++) {
      if (editIndex === -1 || i !== editIndex) {
        totalItemsInCart += cart[i].quantity;
      }
    }

    const totalAfterIncrease = totalItemsInCart + this.quantity + 1;

    if (totalAfterIncrease > 99) {
      await this.showOverQuantityDialog();
      return false;
    }

    const maxQuantity = this.getMaxQuantity(editIndex);

    if (this.quantity < maxQuantity) {
      this.quantity++;
      return true;
    }
    return false;
  }

  /**
   * decrease order quantity
   */
  decrease(allowZero: boolean = false): void {
    if (allowZero) {
      if (this.quantity > 0) {
        this.quantity--;
      }
    } else {
      if (this.quantity > 1) {
        this.quantity--;
      }
    }
  }

  /**
   * set selected size
   * @param size size to select
   */
  setSelectedSize(size: MenuSelect | null): void {
    if (size && size.soldOut) return;
    this.selectedSize = size;
  }

  /**
   * calculate total price including size, toppings and quantity
   * @returns total price
   */
  getTotalPrice(): number {
    const sizePrice = this.selectedSize?.price ?? 0;
    const toppingPrice = this.selectedToppings.reduce(
      (sum, t) => sum + t.price,
      0
    );
    return (this.menu.price + sizePrice + toppingPrice) * this.quantity;
  }

  /**
   * get confirmation data for order
   * @returns order confirmation data
   */
  getConfirmData() {
    const lang = AppConfig.Instance.currentLang.value;
    return {
      menuCd: this.menu.menu_cd,
      name: getMenuName(this.rawMenu, lang),
      imagePath: this.menu.imagePath,
      basePrice: this.menu.price,
      quantity: this.quantity,
      size: this.selectedSize
        ? {
          selectCd: this.selectedSize.select_cd,
          name: getMenuSelectName(this.selectedSize, lang),
          price: this.selectedSize.price,
        }
        : null,

      toppings: this.selectedToppings.map(t => ({
        selectCd: t.select_cd,
        name: getMenuSelectName(t, lang),
        price: t.price,
      })),

      total: this.getTotalPrice(),
    };
  }

  /**
   * Load data from cart item for editing
   * @param cartItem Cart item to load from
   */
  loadFromCartItem(cartItem: any): void {
    this.quantity = cartItem.quantity;

    if (cartItem.size) {
      const size = this.sizes.find(s => s.select_cd === cartItem.size.selectCd);
      if (size) {
        this.selectedSize = size;
      }
    }

    if (cartItem.toppings && cartItem.toppings.length > 0) {
      this.selectedToppings = cartItem.toppings
        .map((t: any) => this.toppings.find(topping => topping.select_cd === t.selectCd))
        .filter((t: any) => t !== undefined);
    }
  }

  /**
   * reset menu detail to default state
   */
  reset(): void {
    this.quantity = 1;
    this.selectedSize = this.sizes.length > 0 ? this.sizes[0] : null;
    this.selectedToppings = [];
  }

  /**
   * show confirm dialog before deleting cart item
   * @returns true if user confirmed
   */
  async confirmDeleteOrder(): Promise<boolean> {
    const confirmDialog = new DialogArgs();
    confirmDialog.message = 'DELETE_CONFIRM_MESSAGE';
    confirmDialog.comment = '';
    confirmDialog.messageType = DialogMessageType.Error;
    confirmDialog.buttons = [
      { id: DialogButtonId.Cancel, text: 'CANCEL_BUTTON' },
      { id: DialogButtonId.Confirm, text: 'AGREE_BUTTON' },
    ];

    const result = await GlobalEvent.Instance.showCommonDialog(confirmDialog);
    return result === DialogButtonId.Confirm;
  }

  /**
   * confirm add/update cart item and return the item
   * @param editMode true when editing existing cart item
   * @param cartIndex index of cart item when editMode is true
   * @returns object with cart item and hasChanges flag, or null if quantity exceeds limit
   */
  async confirm(
    editMode: boolean,
    cartIndex: number
  ): Promise<{ item: CartItem; hasChanges: boolean } | null> {
    const lang = AppConfig.Instance.currentLang.value;
    const item = this.getConfirmData();

    const cart = CartStorage.getCart();
    let totalItemsInCart = 0;

    for (let i = 0; i < cart.length; i++) {
      if (!editMode || i !== cartIndex) {
        totalItemsInCart += cart[i].quantity;
      }
    }

    const totalAfterConfirm = totalItemsInCart + this.quantity;

    if (totalAfterConfirm > 99) {
      await this.showOverQuantityDialog();
      return null;
    }

    const cartItem: CartItem = {
      ...item,
      name: getMenuName(this.rawMenu, lang),
      imagePath: item.imagePath || '',
    };

    let hasChanges = true;

    if (editMode && cartIndex >= 0) {
      const existingItem = cart[cartIndex];
      hasChanges = this.hasItemChanged(existingItem, cartItem);

      if (hasChanges) {
        CartStorage.updateItem(cartIndex, cartItem);
      }
    } else {
      CartStorage.addItem(cartItem);
    }

    return { item: cartItem, hasChanges };
  }

  /**
   * check if cart item has been modified
   * @param existing existing cart item
   * @param updated updated cart item
   * @returns true if items are different
   */
  private hasItemChanged(existing: CartItem, updated: CartItem): boolean {
    console.log('Checking changes:', {
      existing: {
        quantity: existing.quantity,
        size: existing.size?.selectCd,
        toppings: existing.toppings.map(t => t.selectCd)
      },
      updated: {
        quantity: updated.quantity,
        size: updated.size?.selectCd,
        toppings: updated.toppings.map(t => t.selectCd)
      }
    });

    // Check quantity
    if (existing.quantity !== updated.quantity) {
      console.log('Quantity changed');
      return true;
    }

    // Check size - handle null/undefined cases properly
    const existingSizeCd = existing.size?.selectCd || null;
    const updatedSizeCd = updated.size?.selectCd || null;
    if (existingSizeCd !== updatedSizeCd) {
      console.log('Size changed');
      return true;
    }

    // Check toppings
    if (existing.toppings.length !== updated.toppings.length) {
      console.log('Toppings length changed');
      return true;
    }

    const existingToppingCds = existing.toppings.map(t => t.selectCd).sort();
    const updatedToppingCds = updated.toppings.map(t => t.selectCd).sort();

    for (let i = 0; i < existingToppingCds.length; i++) {
      if (existingToppingCds[i] !== updatedToppingCds[i]) {
        console.log('Toppings changed');
        return true;
      }
    }

    console.log('No changes detected');
    return false;
  }

  /**
   * remove cart item at index
   * @param cartIndex index of item to remove
   */
  delete(cartIndex: number): void {
    if (cartIndex >= 0) {
      CartStorage.removeItem(cartIndex);
    }
  }

  /**
   * increase quantity (used in edit mode)
   * @param editIndex index of item being edited
   * @returns Promise that resolves to true if quantity was increased, false if limit reached
   */
  async increaseQuantity(editIndex: number): Promise<boolean> {
    const cart = CartStorage.getCart();
    let totalItemsInCart = 0;

    for (let i = 0; i < cart.length; i++) {
      if (i !== editIndex) {
        totalItemsInCart += cart[i].quantity;
      }
    }

    const totalAfterIncrease = totalItemsInCart + this.quantity + 1;

    if (totalAfterIncrease > 99) {
      await this.showOverQuantityDialog();
      return false;
    }

    const max = this.getMaxQuantity(editIndex);
    if (this.quantity < max) {
      this.quantity++;
      return true;
    }
    return false;
  }

  /**
   * decrease quantity; in edit mode at 1, show delete confirm
   * @param editMode true when editing existing cart item
   * @param cartIndex index of cart item when editMode is true
   * @returns 'deleted' | 'decreased' | 'cancel'
   */
  async decreaseQuantity(
    editMode: boolean,
    cartIndex: number
  ): Promise<'deleted' | 'decreased' | 'cancel'> {
    if (!editMode) {
      if (this.quantity > 1) {
        this.quantity--;
      }
      return 'decreased';
    }
    if (this.quantity > 1) {
      this.quantity--;
      return 'decreased';
    }

    const confirmed = await this.confirmDeleteOrder();
    if (confirmed) {
      this.delete(cartIndex);
      return 'deleted';
    }

    this.quantity = 1;
    return 'cancel';
  }
}