import { ref, computed, watch, Ref } from 'vue';
import { DataPool } from '@/model/DataPool';
import { Language } from '@/model/Enums';
import { Menu, MenuItem } from '@/model/Menu';
import { GlobalEvent } from '../common/GlobalEvent';
import { FooterLogic } from '../common/FooterLogic';
import { AppConfig } from '@/model/AppConfig';
import { getMenuDescription, getMenuName } from '@/util/DictNormalizerUtil';

export class MenuListLogic {
  private dataPool = DataPool.Instance;
  private config = AppConfig.Instance;
  private footerLogic = new FooterLogic();

  private pageSize = 4;
  private currentPage = ref(0);
  private menus = ref<MenuItem[]>([]);

  readonly showAllergen = this.footerLogic.showAllergen;
  readonly currentLang = this.config.currentLang;
  readonly categoryName = computed(() => {
    const cd = GlobalEvent.Instance.currentCategoryCd.value;
    if (!cd) return '';
    const category = this.dataPool.getCategoryByCd(cd);
    if (!category) return '';
    return getMenuName(category, this.currentLang.value);
  });
  readonly pagedMenus = computed(() => {
    const start = this.currentPage.value * this.pageSize;
    return this.menus.value.slice(start, start + this.pageSize);
  });
  readonly totalPages = computed(() => {
    return Math.ceil(this.menus.value.length / this.pageSize);
  });

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

  openAllergen(): void {
    this.footerLogic.openAllergen();
  }

  closeAllergen(): void {
    this.footerLogic.closeAllergen();
  }

  get languageOptions() {
    return this.footerLogic.languageOptions;
  }

  get pageIndex(): Ref<number> {
    return this.currentPage;
  }

  changeLanguage(lang: Language): void {
    this.config.currentLang.value = lang;
    this.footerLogic.changeLanguage(lang);
  }

  async callStaff(): Promise<void> {
    await this.footerLogic.callStaff();
  }

  nextPage(): void {
    if (this.currentPage.value < this.totalPages.value - 1) {
      this.currentPage.value++;
    }
  }

  prevPage(): void {
    if (this.currentPage.value > 0) {
      this.currentPage.value--;
    }
  }

  backToCategory(): void {
    GlobalEvent.Instance.goToCategoryPage();
  }

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
    return getMenuName(category, lang);
  }

  onBackToCategory(): void {
    GlobalEvent.Instance.goToCategoryPage();
  }
}
