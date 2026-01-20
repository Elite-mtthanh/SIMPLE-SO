import { ServiceIF } from "@/services/ServiceIF";
import { Menu, MenuSelect } from "./Menu";

export class DataPool {
  public static Instance: DataPool;

  public allMenus: Menu[] = [];
  public allSelects : MenuSelect[] = [];

  static init(): void {
    if (!this.Instance) {
      this.Instance = new DataPool(); 
      this.Instance.loadData();
    }
  }

  private loadData(): void {
    this.allMenus = ServiceIF.getAllMenus();
    this.allSelects = ServiceIF.getAllMenuSelects();
  }

  getMenus(parent_menu_cd: string): Menu[] {
    return this.allMenus.filter(menu => menu.parent_menu_cd === parent_menu_cd && menu.menu_type === 'menu');
  }

  getCategories(parent_menu_cd: string = '000'): Menu[] {
    return this.allMenus.filter(menu => menu.parent_menu_cd === parent_menu_cd && menu.menu_type === 'category');
  }
}
