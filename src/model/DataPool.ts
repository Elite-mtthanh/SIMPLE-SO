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
  /** stockout size map */
  public stockoutSize: Record<string, boolean> = {};

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
    this.loadStockoutSize();
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
   * load stockout size data
   */
  private loadStockoutSize(): void {
    const list = ServiceIF.getStockoutSizeList();
    this.stockoutSize = {};

    list.forEach(size => {
      this.stockoutSize[size.select_cd] = true;
    });
  }

  /**
   * check whether size is stockout
   * @param selectCd 
   * @returns 
   */
  isSizeStockout(selectCd: string): boolean {
    return !!this.stockoutSize[selectCd];
  }

  /**
   * check whether menu is stockout
   * menu is considered stockout if:
   * 1. It's in stockout list, OR
   * 2. It has sizes and ALL sizes are stockout
   * @param menuCd 
   * @returns 
   */
  isStockout(menuCd: string): boolean {
    if (this.stockoutMenu[menuCd]) {
      return true;
    }
    
    const menu = this.getMenuByCd(menuCd);
    if (!menu || !menu.select_size || menu.select_size === '0' || menu.select_size === '') {
      return false; 
    }
    
    const sizes = this.getMenuSizes(menu.select_size);
    if (sizes.length === 0) {
      return false; 
    }
    
    const allSizesSoldOut = sizes.every(size => this.isSizeStockout(size.select_cd));
    return allSizesSoldOut;
  }

  /**
   * check whether category is stockout
   * category is considered stockout if ALL menus in it are stockout
   * @param categoryCd 
   * @returns 
   */
  isCategoryStockout(categoryCd: string): boolean {
    const menus = this.getMenus(categoryCd);
    
    if (menus.length === 0) {
      return false; 
    }
    
    const allMenusSoldOut = menus.every(menu => this.isStockout(menu.menu_cd));
    return allMenusSoldOut;
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