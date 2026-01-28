import { ref, computed, watch, Ref } from 'vue';
import { DataPool } from '@/model/DataPool';
import { Menu, MenuItem } from '@/model/Menu';
import { GlobalEvent } from '../common/GlobalEvent';
import { FooterLogic } from '../common/FooterLogic';
import { AppConfig } from '@/model/AppConfig';
import { getMenuDescription, getMenuName } from '@/util/DictNormalizerUtil';
import { CartStorage } from '@/storage/CartStorage';
import { Language } from '@/model/Enums';

export class MenuListPageLogic {
  private dataPool = DataPool.Instance;
  private config = AppConfig.Instance;
  private footerLogic = new FooterLogic();

  /** number of items per page */
  private pageSize = 4;
  
  /** current page index */
  private currentPage = ref(0);
  
  /** list of menu items */
  private menus = ref<MenuItem[]>([]);

  /** allergen dialog visibility status */
  readonly showAllergen = this.footerLogic.showAllergen;
  
  /** current language */
  readonly currentLang = this.config.currentLang;
  
  /** get current category name */
  readonly categoryName = computed(() => {
    const cd = GlobalEvent.Instance.currentCategoryCd.value;
    if (!cd) return '';
    const category = this.dataPool.getCategoryByCd(cd);
    if (!category) return '';
    return getMenuName(category, this.currentLang.value);
  });
  
  /** get menus for current page */
  readonly pagedMenus = computed(() => {
    const start = this.currentPage.value * this.pageSize;
    return this.menus.value.slice(start, start + this.pageSize);
  });
  
  /** get total number of pages */
  readonly totalPages = computed(() => {
    return Math.ceil(this.menus.value.length / this.pageSize);
  });

  /**
   * constructor - initialize and setup watchers
   */
  constructor() {
    this.reloadMenus();

    watch(this.currentLang, () => {
      this.currentPage.value = 0;
      this.reloadMenus();
    });

    watch(
      () => GlobalEvent.Instance.currentCategoryCd.value,
      () => {
        this.currentPage.value = 0;
        this.reloadMenus();
      }
    );
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

  /** get available language options */
  get languageOptions() {
    return this.footerLogic.languageOptions;
  }

  /** get current page index */
  get pageIndex(): Ref<number> {
    return this.currentPage;
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
   * navigate to next page
   */
  nextPage(): void {
    if (this.currentPage.value < this.totalPages.value - 1) {
      this.currentPage.value++;
    }
  }

  /**
   * navigate to previous page
   */
  prevPage(): void {
    if (this.currentPage.value > 0) {
      this.currentPage.value--;
    }
  }

  /**
   * navigate back to category page
   */
  backToCategory(): void {
    GlobalEvent.Instance.goToCategoryPage();
  }

  /**
   * reload menu items based on current category and language
   */
  private reloadMenus(): void {
    const categoryCd = GlobalEvent.Instance.currentCategoryCd.value;
    if (!categoryCd) {
      this.menus.value = [];
      return;
    }

    const lang = this.currentLang.value;
    const menus = this.dataPool.getMenus(categoryCd);

    this.menus.value = menus.map(menu => ({
      id: menu.id,
      menu_cd: menu.menu_cd,
      name: getMenuName(menu, lang),
      description: getMenuDescription(menu, lang),
      price: menu.price,
      imagePath: menu.image_path,
      soldOut: this.dataPool.isStockout(menu.menu_cd),
      hasSelectSize: (!!menu.select_size && menu.select_size !== '0') ? '1' : '0',
    }));
  }

  /** get current category name */
  get currentCategoryName(): string {
    const categoryCd = GlobalEvent.Instance.currentCategoryCd.value;

    if (!categoryCd) return '';

    const category = this.dataPool.getCategoryByCd(categoryCd);
    if (!category) return '';

    const lang = this.config.currentLang.value;
    return getMenuName(category, lang);
  }

  /**
   * navigate back to category page
   */
  onBackToCategory(): void {
    GlobalEvent.Instance.goToCategoryPage();
  }

  openOrderList(): void {
    GlobalEvent.Instance.emitEvent('show-order-list-dialog');
  }

  get cartCount(): number {
    return CartStorage.getCart().length;
  }
}