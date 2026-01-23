import { ServiceIF } from "@/services/ServiceIF";
import { Menu, MenuSelect } from "./Menu";

export class DataPool {
  public static Instance: DataPool;

  public allMenus: Menu[] = [];
  public allSelects: MenuSelect[] = [];
  public soldOutMenu: Record<string, boolean> = {};

  static init(): void {
    if (!this.Instance) {
      this.Instance = new DataPool();
      this.Instance.loadData();
    }
  }

  private loadData(): void {
    this.allMenus = ServiceIF.getAllMenus();
    this.allSelects = ServiceIF.getAllMenuSelects();
    this.loadStockout();
  }

  getMenus(parent_menu_cd: string): Menu[] {
    return this.allMenus.filter(menu => menu.parent_menu_cd === parent_menu_cd && menu.menu_type === 'menu');
  }

  getCategories(parent_menu_cd: string = '000'): Menu[] {
    return this.allMenus.filter(menu => menu.parent_menu_cd === parent_menu_cd && menu.menu_type === 'category');
  }

  getCategoryByCd(categoryCd: string): Menu | null {
    return this.allMenus.find(
      menu => menu.menu_type === 'category' && menu.menu_cd === categoryCd
    ) ?? null;
  }

  private loadStockout(): void {
    const list = ServiceIF.getStockoutList();
    this.soldOutMenu = {};

    list.forEach(menu => {
      this.soldOutMenu[menu.menu_cd] = true;
    });
  }

  isSoldOut(menuCd: string): boolean {
    return !!this.soldOutMenu[menuCd];
  }

  getMenuByCd(menuCd: string): Menu | null {
    return this.allMenus.find(menu => menu.menu_cd === menuCd) ?? null;
  }

  getMenuSelects(select_size: string) {
    return this.allSelects.filter(select => select.menu_cd === select_size);
  }

  getMenuSizes(select_size: string) {
    return this.allSelects.filter(
      size => size.menu_cd === select_size && size.select_type === 'size'
    );
  }

  getMenuToppings(select_size: string) {
    return this.allSelects.filter(
      topping => topping.menu_cd === select_size && topping.select_type === 'topping'
    );
  }
}
