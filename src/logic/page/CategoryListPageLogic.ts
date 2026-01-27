import { computed } from 'vue';
import { DataPool } from '@/model/DataPool';
import { AppConfig } from '@/model/AppConfig';
import { Language } from '@/model/Enums';
import { Menu } from '@/model/Menu';
import { GlobalEvent } from '../common/GlobalEvent';
import { FooterLogic } from '../common/FooterLogic';
import { getMenuName } from '@/util/DictNormalizerUtil';

export class CategoryListPageLogic {
  private dataPool = DataPool.Instance;
  private config = AppConfig.Instance;
  private footerLogic = new FooterLogic();

  /** allergen dialog visibility status */
  readonly showAllergen = this.footerLogic.showAllergen;
  
  /** current language */
  readonly currentLang = this.config.currentLang;
  
  /** get list of categories */
  readonly categoryList = computed(() => {
    const parentMenuCd = '000';
    const lang = this.config.currentLang.value;

    const categories = this.dataPool.getCategories(parentMenuCd);

    return categories.map(menu => ({
      id: menu.id,
      name: getMenuName(menu, lang),
      image_path: menu.image_path,
      menu_cd: menu.menu_cd
    }));
  });

  /** get available language options */
  get languageOptions() {
    return this.footerLogic.languageOptions;
  }

  /**
   * change application language
   * @param lang language to change to
   */
  changeLanguage(lang: Language): void {
    this.config.currentLang.value = lang;
    this.footerLogic.changeLanguage(lang);
  }

  /**
   * call staff functionality
   */
  async callStaff(): Promise<void> {
    await this.footerLogic.callStaff();
  }

  /**
   * open allergen dialog
   */
  openAllergen(): void {
    this.footerLogic.openAllergen();
  }

  /**
   * close allergen dialog
   */
  closeAllergen(): void {
    this.footerLogic.closeAllergen();
  }

  /**
   * navigate to menu page for selected category
   * @param categoryCode category menu object
   */
  goToMenuPage(categoryCode: Menu): void {
    GlobalEvent.Instance.goToMenuPage(categoryCode.menu_cd);
    console.log(categoryCode.menu_cd)
  }
}