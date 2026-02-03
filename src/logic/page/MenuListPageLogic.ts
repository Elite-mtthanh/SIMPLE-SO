import { ref, computed, watch, Ref } from 'vue';
import { DataPool } from '@/model/DataPool';
import { MenuItem } from '@/model/Menu';
import { GlobalEvent } from '../common/GlobalEvent';
import { FooterLogic } from '../common/FooterLogic';
import { AppConfig } from '@/model/AppConfig';
import { getMenuDescription, getMenuName, normalizeTextWithLineLimit } from '@/util/DictNormalizerUtil';
import { CartStorage } from '@/storage/CartStorage';
import { Language } from '@/model/Enums';

export class MenuListPageLogic {
  /** data pool instance */
  private dataPool = DataPool.Instance;
  /** app config instance */
  private config = AppConfig.Instance;
  /** footer logic for language, allergen, call staff */
  private footerLogic = new FooterLogic();

  /** number of items per page */
  private pageSize = 4;

  /** current page index */
  private currentPage = ref(0);

  /** list of menu items */
  private menus = ref<MenuItem[]>([]);

  /** swipe detection properties */
  private touchStartX = 0;
  private touchStartY = 0;

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

  /** get visible pages for pagination dots (max 4) 
   * According to spec: max 16 items = 4 pages = 4 dots
   */
  readonly visiblePages = computed(() => {
    const total = this.totalPages.value;
    return Math.min(total, 4);
  });

  /** cart count for footer (reactive, updates on cart-updated) */
  private cartCountRef = ref(this.calculateTotalQuantity());

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
   * handle touch start event for swipe detection
   */
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  /**
   * handle touch end event for swipe detection
   */
  onTouchEnd(e: TouchEvent) {
    const deltaX = e.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(deltaX) < 50) return;
    deltaX > 0 ? this.prevPage() : this.nextPage();
  }


  /**
   * navigate back to category page
   */
  backToCategory(): void {
    GlobalEvent.Instance.goToCategoryPage();
  }

  /**
   * reload menu items based on current category and language
   * Note: Max 16 items (4 pages x 4 items/page) according to spec
   */
  private reloadMenus(): void {
    const categoryCd = GlobalEvent.Instance.currentCategoryCd.value;
    if (!categoryCd) {
      this.menus.value = [];
      return;
    }

    const lang = this.currentLang.value;
    const menus = this.dataPool.getMenus(categoryCd);
    const limitedMenus = menus.slice(0, 16);

    this.menus.value = limitedMenus.map(menu => ({
      id: menu.id,
      menu_cd: menu.menu_cd,
      name: normalizeTextWithLineLimit(getMenuName(menu, lang), 2),
      description: normalizeTextWithLineLimit(getMenuDescription(menu, lang), 3),
      price: menu.price,
      imagePath: menu.image_path,
      soldOut: this.dataPool.isStockout(menu.menu_cd),
      hasSelectSize: menu.select_size !== null ? '1' : '0',
    }));
  }

  /** get current category display name for header */
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

  /**
   * open order list page
   */
  openOrderList(): void {
    GlobalEvent.Instance.goToOrderListPage();
  }

  /** cart count for footer (reactive) */
  get cartCount(): Ref<number> {
    return this.cartCountRef;
  }
}