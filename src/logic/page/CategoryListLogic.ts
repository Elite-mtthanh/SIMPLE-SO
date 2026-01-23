import { DataPool } from '@/model/DataPool';
import { AppConfig } from '@/model/AppConfig';
import { Language } from '@/model/Enums';
import { Category, Menu } from '@/model/Menu';
import { GlobalEvent } from '../common/GlobalEvent';
import { FooterLogic } from '../common/FooterLogic';
import { getMenuName } from '@/util/DictNormalizer';

export class CategoryListLogic {
  private dataPool = DataPool.Instance;
  private config = AppConfig.Instance;
  private footerLogic = new FooterLogic();

  get languageOptions() {
    return this.footerLogic.languageOptions;
  }

  changeLanguage(lang: Language): void {
    this.footerLogic.changeLanguage(lang);
  }

  async callStaff(): Promise<void> {
    await this.footerLogic.callStaff();
  }

  get getCategoryList(): Category[] {
    const parentMenuCd = '000';
    const categories = this.dataPool.getCategories(parentMenuCd);
    const lang = this.config.currentLang.value;
    console.log(categories)
    return categories.map(menu => ({
      id: menu.id,
      name: getMenuName(menu, lang),
      image_path: menu.image_path,
      menu_cd: menu.menu_cd
    }));
  }

  goToMenuPage(categoryCode: Menu): void {
    GlobalEvent.Instance.goToMenuPage(categoryCode.menu_cd);
    console.log(categoryCode.menu_cd)
  }
}
