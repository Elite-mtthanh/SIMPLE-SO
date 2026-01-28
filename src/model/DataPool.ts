import { ServiceIF } from "@/services/ServiceIF";
import { Menu, MenuSelect } from "./Menu";
import { MenuSelectType, MenuType } from "./Enums";

export class DataPool {
  public static Instance: DataPool;

  public allMenus: Menu[] = [];
  public allSelects: MenuSelect[] = [];
  public stockoutMenu: Record<string, boolean> = {};

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
    return this.allMenus.filter(menu =>
      menu.parent_menu_cd === parent_menu_cd
      && menu.menu_type === MenuType.Menu
    );
  }

  hasMenuInCategory(categoryCd: string): boolean {
    return this.allMenus.some(menu =>
      menu.menu_type === MenuType.Menu &&
      typeof menu.parent_menu_cd === 'string' &&
      menu.parent_menu_cd.trim() === categoryCd
    );
  }


  getCategories(parent_menu_cd: string): Menu[] {
    return this.allMenus.filter(menu =>
      menu.menu_type === MenuType.Category &&
      !!menu.parent_menu_cd &&
      menu.parent_menu_cd === parent_menu_cd
    );
  }

  getCategoryByCd(categoryCd: string): Menu | null {
    return this.allMenus.find(
      menu => menu.menu_type === MenuType.Category && menu.menu_cd === categoryCd
    ) ?? null;
  }

  private loadStockout(): void {
    const list = ServiceIF.getStockoutList();
    this.stockoutMenu = {};

    list.forEach(menu => {
      this.stockoutMenu[menu.menu_cd] = true;
    });
  }

  isStockout(menuCd: string): boolean {
    return !!this.stockoutMenu[menuCd];
  }

  getMenuByCd(menuCd: string): Menu | null {
    return this.allMenus.find(menu => menu.menu_cd === menuCd) ?? null;
  }

  getMenuSelects(menu_cd: string) {
    return this.allSelects.filter(select => select.menu_cd === menu_cd);
  }

  getMenuSizes(menu_cd: string) {
    return this.allSelects.filter(
      size => size.menu_cd === menu_cd && size.select_type === MenuSelectType.Size
    );
  }

  getMenuToppings(menu_cd: string) {
    return this.allSelects.filter(
      topping => topping.menu_cd === menu_cd && topping.select_type === MenuSelectType.Topping
    );
  }
}
