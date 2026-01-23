import { ref, Ref, computed } from 'vue';
import { DataPool } from '@/model/DataPool';
import { AppConfig } from '@/model/AppConfig';
import { Language } from '@/model/Enums';
import { Category, Menu } from '@/model/Menu';
import { GlobalEvent } from '../common/GlobalEvent';
import { FooterLogic } from '../common/FooterLogic';

export class CategoryListLogic {
  private dataPool = DataPool.Instance;
  private config = AppConfig.Instance;
  private footerLogic = new FooterLogic();

  currentLang: Ref<Language> = ref(Language.JA);
  showAllergen: Ref<boolean> = ref(false);

  get languageOptions() {
    return this.footerLogic.languageOptions;
  }

  changeLanguage(lang: Language): void {
    this.currentLang.value = lang;
    this.footerLogic.changeLanguage(lang);
  }

  async callStaff(): Promise<void> {
    await this.footerLogic.callStaff();
  }

  openAllergen(): void {
    this.showAllergen.value = true;
  }

  closeAllergen(): void {
    this.showAllergen.value = false;
  }

  get categoryList(): Category[] {
    const parentMenuCd = '000';
    const lang = this.config.currentLang.value;

    const categories = this.dataPool.getCategories(parentMenuCd);

    return categories.map(menu => ({
      id: menu.menu_cd,
      name: this.getMenuName(menu, lang),
      image_path: menu.image_path,
    }));
  }

  private getMenuName(menu: Menu, lang: Language): string {
    switch (lang) {
      case Language.JA: return menu.menu_name1;
      case Language.ZH: return menu.menu_name2;
      case Language.EN: return menu.menu_name3;
      default: return menu.menu_name1;
    }
  }

  goToMenuPage(category: Category): void {
    GlobalEvent.Instance.goToMenuPage(category.id);
  }
}
