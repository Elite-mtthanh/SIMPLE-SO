import { DataPool } from '@/model/DataPool';
import { MenuItem, MenuSelect } from '@/model/Menu';
import { AppConfig } from '@/model/AppConfig';
import { getMenuDescription, getMenuName, getMenuSelectName } from '@/util/DictNormalizerUtil';

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
  load(menuCd: string): void {
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
   * increase order quantity
   */
  increase(): void {
    if (this.quantity < 10) {
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
      menu: this.menu,
      quantity: this.quantity,
      size: this.selectedSize,
      toppings: [...this.selectedToppings],
      total: this.getTotalPrice(),
    };
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