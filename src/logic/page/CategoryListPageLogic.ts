import { computed, ref, Ref } from 'vue';
import { DataPool } from '@/model/DataPool';
import { AppConfig } from '@/model/AppConfig';
import { Language } from '@/model/Enums';
import { Menu } from '@/model/Menu';
import { GlobalEvent } from '../common/GlobalEvent';
import { FooterLogic } from '../common/FooterLogic';
import { getMenuName, normalizeTextWithLineLimit } from '@/util/DictNormalizerUtil';
import { CartStorage } from '@/storage/CartStorage';

export class CategoryListPageLogic {
  /** data pool instance */
  private dataPool = DataPool.Instance;
  /** app config instance */
  private config = AppConfig.Instance;
  /** footer logic for language, allergen, call staff */
  private footerLogic = new FooterLogic();

  /** cart count for footer (reactive, updates on cart-updated) */
  private cartCountRef = ref(this.calculateTotalQuantity());

  constructor() {
    GlobalEvent.Instance.on('cart-updated', () => {
      this.cartCountRef.value = this.calculateTotalQuantity();
    });
  }

  /**
   * Calculate total quantity of all items in cart
   * @returns total quantity
   */
  private calculateTotalQuantity(): number {
    const cart = CartStorage.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  /** cart count for footer (reactive) */
  get cartCount(): Ref<number> {
    return this.cartCountRef;
  }

  /** allergen dialog visibility status */
  readonly showAllergen = this.footerLogic.showAllergen;

  /** current language */
  readonly currentLang = this.config.currentLang;

  /** get list of categories */
  readonly categoryList = computed(() => {
    const parentMenuCd = '000';
    const lang = this.config.currentLang.value;

    const categories = this.dataPool
      .getCategories(parentMenuCd)
      .filter(category =>
        this.dataPool.hasMenuInCategory(category.menu_cd)
      )
      .slice(0, 10);

    return categories.map(menu => ({
      id: menu.id,
      name: normalizeTextWithLineLimit(getMenuName(menu, lang), 1),
      image_path: menu.image_path,
      menu_cd: menu.menu_cd,
      soldOut: this.dataPool.isCategoryStockout(menu.menu_cd),
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
  }

  /**
   * open order list page
   */
  openOrderList(): void {
    GlobalEvent.Instance.goToOrderListPage();
  }
}