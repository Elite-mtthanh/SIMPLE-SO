import { computed } from 'vue';
import { DataPool } from '@/model/DataPool';
import { AppConfig } from '@/model/AppConfig';
import { Language } from '@/model/Enums';
import { Menu } from '@/model/Menu';
import { GlobalEvent } from '../common/GlobalEvent';
import { FooterLogic } from '../common/FooterLogic';
import { getMenuName } from '@/util/DictNormalizerUtil';

export class CategoryListLogic {
  private dataPool = DataPool.Instance;
  private config = AppConfig.Instance;
  private footerLogic = new FooterLogic();

  readonly showAllergen = this.footerLogic.showAllergen;
  readonly currentLang = this.config.currentLang;
  readonly categoryList = computed(() => {
    const parentMenuCd = '000';
    const lang = this.config.currentLang.value;

    const categories = this.dataPool.getCategories(parentMenuCd);

    return categories.map(menu => ({
      id: menu.id,
      name: this.getMenuName(menu, lang),
      image_path: menu.image_path,
      menu_cd: menu.menu_cd
    }));
  });

  get languageOptions() {
    return this.footerLogic.languageOptions;
  }

  changeLanguage(lang: Language): void {
    this.config.currentLang.value = lang;
    this.footerLogic.changeLanguage(lang);
  }

  async callStaff(): Promise<void> {
    await this.footerLogic.callStaff();
  }

  openAllergen(): void {
    this.footerLogic.openAllergen();
  }

  closeAllergen(): void {
    this.footerLogic.closeAllergen();
  }

  private getMenuName(menu: Menu, lang: Language): string {
    switch (lang) {
      case Language.JA: return menu.menu_name1;
      case Language.ZH: return menu.menu_name2;
      case Language.EN: return menu.menu_name3;
      default: return menu.menu_name1;
    }
  }

  goToMenuPage(categoryCode: Menu): void {
    GlobalEvent.Instance.goToMenuPage(categoryCode.menu_cd);
    console.log(categoryCode.menu_cd)
  }
}
