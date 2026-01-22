import { DataPool } from '@/model/DataPool';
import { Language } from '@/model/Enums';
import { Menu, MenuItem } from '@/model/Menu';
import { GlobalEvent } from '../common/GlobalEvent';
import { FooterLogic } from '../common/FooterLogic';
import { AppConfig } from '@/model/AppConfig';

export class MenuListLogic {
  private dataPool = DataPool.Instance;
  private config = AppConfig.Instance;
  private footerLogic = new FooterLogic();

  get languageOptions() {
    return this.footerLogic.languageOptions;
  }

  get currentCategoryCd() {
    return GlobalEvent.Instance.currentCategoryCd.value;
  }

  changeLanguage(lang: Language): void {
    this.footerLogic.changeLanguage(lang);
  }

  async callStaff(): Promise<void> {
    await this.footerLogic.callStaff();
  }

  isSoldOut(menuCd: string): boolean {
    return this.dataPool.isSoldOut(menuCd);
  }

  get getMenuList(): MenuItem[] {
    const categoryCd = GlobalEvent.Instance.currentCategoryCd.value;

    if (!categoryCd) return [];

    const menus = this.dataPool.getMenus(categoryCd);
    const lang = this.config.currentLang.value;

    return menus.map(menu => ({
      id: menu.id,
      menu_cd: menu.menu_cd,
      name: this.getMenuName(menu, lang),
      description: this.getMenuDescription(menu, lang),
      price: menu.price,
      imagePath: menu.image_path,
      soldOut: this.dataPool.isSoldOut(menu.menu_cd),
      hasSelectSize: (!!menu.select_size && menu.select_size !== '0') ? '1' : '0',
    }));
  }

  get currentCategoryName(): string {
    const categoryCd = GlobalEvent.Instance.currentCategoryCd.value;

    if (!categoryCd) return '';

    const category = this.dataPool.getCategoryByCd(categoryCd);
    if (!category) return '';

    const lang = this.config.currentLang.value;
    return this.getMenuName(category, lang);
  }

  private getMenuName(menu: Menu, lang: Language): string {
    switch (lang) {
      case Language.JA: return menu.menu_name1 ?? '';
      case Language.ZH: return menu.menu_name2 ?? '';
      case Language.EN: return menu.menu_name3 ?? '';
      default: return menu.menu_name1 ?? '';
    }
  }

  private getMenuDescription(menu: Menu, lang: Language): string {
    switch (lang) {
      case Language.JA: return menu.menu_desc1 ?? '';
      case Language.ZH: return menu.menu_desc2 ?? '';
      case Language.EN: return menu.menu_desc3 ?? '';
      default: return menu.menu_desc1 ?? '';
    }
  }

  onBackToCategory(): void {
    GlobalEvent.Instance.goToCategoryPage();
  }

  goToMenuDetailPage(menuCd: string): void {
    GlobalEvent.Instance.goToMenuDetailPage(menuCd);
  }
}
