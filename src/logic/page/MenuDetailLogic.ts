import { DataPool } from '@/model/DataPool';
import { MenuItem, MenuSelect } from '@/model/Menu';
import { AppConfig } from '@/model/AppConfig';
import { getMenuDescription, getMenuName } from '@/util/DictNormalizerUtil';

export class MenuDetailLogic {
  private dataPool = DataPool.Instance;
  private config = AppConfig.Instance;

  menu: MenuItem = {} as MenuItem;
  sizes: MenuSelect[] = [];
  toppings: MenuSelect[] = [];

  quantity: number = 1;
  selectedSize: MenuSelect | null = null;
  selectedToppings: MenuSelect[] = [];

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
      soldOut: this.dataPool.isSoldOut(rawMenu.menu_cd),
      hasSelectSize: (!!rawMenu.select_size && rawMenu.select_size !== '0' && rawMenu.select_size !== '') ? '1' : '0',
    };

    if (rawMenu.select_size && rawMenu.select_size !== '0' && rawMenu.select_size !== '') {
      this.sizes = this.dataPool.getMenuSizes(rawMenu.select_size);
      this.toppings = this.dataPool.getMenuToppings(rawMenu.select_size);

      if (this.sizes.length > 0) {
        this.selectedSize = this.sizes[0];
      }
    }
  }

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

  isChecked(topping: MenuSelect): boolean {
    return this.selectedToppings.some((t) => t.select_cd === topping.select_cd);
  }

  increase(): void {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decrease(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  setSelectedSize(size: MenuSelect | null): void {
    this.selectedSize = size;
  }

  getTotalPrice(): number {
    const sizePrice = this.selectedSize?.price ?? 0;
    const toppingPrice = this.selectedToppings.reduce(
      (sum, t) => sum + t.price,
      0
    );
    return (this.menu.price + sizePrice + toppingPrice) * this.quantity;
  }

  getConfirmData() {
    return {
      menu: this.menu,
      quantity: this.quantity,
      size: this.selectedSize,
      toppings: [...this.selectedToppings],
      total: this.getTotalPrice(),
    };
  }

  reset(): void {
    this.quantity = 1;
    this.selectedSize = this.sizes.length > 0 ? this.sizes[0] : null;
    this.selectedToppings = [];
  }
}