import { DataPool } from '@/model/DataPool';
import { Menu, MenuItem, MenuSelect } from '@/model/Menu';
import { AppConfig } from '@/model/AppConfig';
import { getMenuDescription, getMenuName } from '@/util/DictNormalizer';

export class MenuDetailLogic {
  private dataPool = DataPool.Instance;
  private config = AppConfig.Instance;

  menu!: MenuItem;
  sizes: MenuSelect[] = [];
  toppings: MenuSelect[] = [];

  load(menuCd: string): void {
    const rawMenu = this.dataPool.getMenuByCd(menuCd);
    if (!rawMenu) {
      console.error('Menu not found:', menuCd);
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
      console.log('Loaded sizes/toppings for menu:', menuCd, 'select_size:', rawMenu.select_size, 'sizes:', this.sizes.length, 'toppings:', this.toppings.length);
    } else {
      console.log('No select_size for menu:', menuCd);
    }
  }
}
