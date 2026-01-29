import { DataPool } from '@/model/DataPool';
import { MenuItem, MenuSelect } from '@/model/Menu';
import { AppConfig } from '@/model/AppConfig';
import { getMenuDescription, getMenuName, getMenuSelectName } from '@/util/DictNormalizerUtil';
import { CartStorage } from '@/storage/CartStorage';

const MAX_QUANTITY_PER_MENU = 10;

export class MenuDetailLogic {
  private dataPool = DataPool.Instance;
  private config = AppConfig.Instance;

  /** current menu item */
  menu: MenuItem = {} as MenuItem;
  
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

    const lang = this.config.currentLang.value;

    this.menu = {
      id: rawMenu.id,
      menu_cd: rawMenu.menu_cd,
      name: getMenuName(rawMenu, lang),
      description: getMenuDescription(rawMenu, lang),
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
      }));
      
      const menuToppings = this.dataPool.getMenuToppings(rawMenu.select_size);
      this.toppings = menuToppings.map(topping => ({
        ...topping,
        name: getMenuSelectName(topping, lang),
      }));

      if (this.sizes.length > 0) {
        this.selectedSize = this.sizes[0];
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
   * @returns Maximum quantity considering cart items
   */
  getMaxQuantity(): number {
    const size = this.selectedSize
      ? {
          selectCd: this.selectedSize.select_cd,
          name: this.selectedSize.select_name1,
          price: this.selectedSize.price,
        }
      : null;

    const toppings = this.selectedToppings.map(t => ({
      selectCd: t.select_cd,
      name: t.select_name1,
      price: t.price,
    }));

    const maxAddable = CartStorage.getMaxAddableQuantity(
      this.menu.menu_cd,
      size,
      toppings
    );

    return Math.min(MAX_QUANTITY_PER_MENU, maxAddable);
  }

  /**
   * increase order quantity
   */
  increase(): void {
    const maxQuantity = this.getMaxQuantity();
    if (this.quantity < maxQuantity) {
      this.quantity++;
    }
  }

  /**
   * decrease order quantity
   */
  decrease(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  /**
   * set selected size
   * @param size size to select
   */
  setSelectedSize(size: MenuSelect | null): void {
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
    return {
      menuCd: this.menu.menu_cd,
      name: this.menu.name,
      imagePath: this.menu.imagePath,
      basePrice: this.menu.price,

      quantity: this.quantity,

      size: this.selectedSize
        ? {
          selectCd: this.selectedSize.select_cd,
          name: this.selectedSize.select_name1,
          price: this.selectedSize.price,
        }
        : null,

      toppings: this.selectedToppings.map(t => ({
        selectCd: t.select_cd,
        name: t.select_name1,
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
    // Set quantity
    this.quantity = cartItem.quantity;

    // Set selected size
    if (cartItem.size) {
      const size = this.sizes.find(s => s.select_cd === cartItem.size.selectCd);
      if (size) {
        this.selectedSize = size;
      }
    }

    // Set selected toppings
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
}
