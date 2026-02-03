import { ServiceIF } from "@/services/ServiceIF";
import { Menu, MenuSelect } from "./Menu";
import { MenuSelectType, MenuType } from "./Enums";

export class DataPool {
  public static Instance: DataPool;
  /** all menus data */
  public allMenus: Menu[] = [];
  /** all menu selects data */
  public allSelects: MenuSelect[] = [];
  /** stockout menu map */
  public stockoutMenu: Record<string, boolean> = {};

  /** initialize singleton instance and load data */
  static init(): void {
    if (!this.Instance) {
      this.Instance = new DataPool();
      this.Instance.loadData();
    }
  }

  /**
   * load data from service interface
   */
  private loadData(): void {
    this.allMenus = ServiceIF.getAllMenus();
    this.allSelects = ServiceIF.getAllMenuSelects();
    this.loadStockout();
  }

  /**
   * get menus by parent menu code
   * @param parent_menu_cd 
   * @returns 
   */
  getMenus(parent_menu_cd: string): Menu[] {
    return this.allMenus.filter(menu =>
      menu.parent_menu_cd === parent_menu_cd
      && menu.menu_type === MenuType.Menu
    );
  }

  /**
   * get whether category has menus
   * @param categoryCd 
   * @returns 
   */
  hasMenuInCategory(categoryCd: string): boolean {
    return this.allMenus.some(menu =>
      menu.menu_type === MenuType.Menu &&
      typeof menu.parent_menu_cd === 'string' &&
      menu.parent_menu_cd.trim() === categoryCd
    );
  }

  /**
   * get categories by parent menu code
   * @param parent_menu_cd 
   * @returns 
   */

  getCategories(parent_menu_cd: string): Menu[] {
    return this.allMenus.filter(menu =>
      menu.menu_type === MenuType.Category &&
      !!menu.parent_menu_cd &&
      menu.parent_menu_cd === parent_menu_cd
    );
  }

  /**
   * get category by category code
   * @param categoryCd 
   * @returns 
   */
  getCategoryByCd(categoryCd: string): Menu | null {
    return this.allMenus.find(
      menu => menu.menu_type === MenuType.Category && menu.menu_cd === categoryCd
    ) ?? null;
  }

  /**
   * load stockout menu data
   */
  private loadStockout(): void {
    const list = ServiceIF.getStockoutList();
    this.stockoutMenu = {};

    list.forEach(menu => {
      this.stockoutMenu[menu.menu_cd] = true;
    });
  }

  /**
   * check whether menu is stockout
   * @param menuCd 
   * @returns 
   */
  isStockout(menuCd: string): boolean {
    return !!this.stockoutMenu[menuCd];
  }

  /**
   * get menu by menu code
   * @param menuCd 
   * @returns 
   */
  getMenuByCd(menuCd: string): Menu | null {
    return this.allMenus.find(menu => menu.menu_cd === menuCd) ?? null;
  }

  /**
   * get menu selects by menu code
   * @param menu_cd 
   * @returns 
   */

  getMenuSelects(menu_cd: string) {
    return this.allSelects.filter(select => select.menu_cd === menu_cd);
  }

  /** 
   * get menu sizes by menu code
   * @param menu_cd 
   * @returns 
   */
  getMenuSizes(menu_cd: string) {
    return this.allSelects.filter(
      size => size.menu_cd === menu_cd && size.select_type === MenuSelectType.Size
    );
  }

  /** 
   * get menu toppings by menu code
   * @param menu_cd 
   * @returns 
   */
  getMenuToppings(menu_cd: string) {
    return this.allSelects.filter(
      topping => topping.menu_cd === menu_cd && topping.select_type === MenuSelectType.Topping
    );
  }
}
