import { ServiceIF } from "@/services/ServiceIF";
import { Menu, MenuSelect } from "./Menu";
import { MenuType } from "./Enums";

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
    return this.allMenus.filter(menu => menu.parent_menu_cd === parent_menu_cd && menu.menu_type === MenuType.Menu);
  }

  getCategories(parent_menu_cd: string = '000'): Menu[] {
    return this.allMenus.filter(menu => menu.parent_menu_cd === parent_menu_cd && menu.menu_type === MenuType.Category);
  }

  getCategoryByCd(categoryCd: string): Menu | null {
    return this.allMenus.find(
      menu => menu.menu_type === MenuType.Category && menu.menu_cd === categoryCd
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
}
