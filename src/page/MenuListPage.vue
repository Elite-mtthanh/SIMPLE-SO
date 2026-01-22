<template>
  <div class="menu">
    <header class="menu-header">
      <span class="menu-header-label">
        {{ categoryName }}
      </span>
    </header>

    <div class="menu-pagination-wrapper">
      <div
        class="page-btn page-btn--prev"
        :class="{ 'page-btn--hidden': currentPage === 0 }"
        @click="onPrev"
      >
        <ImageView src="/Image/menu/prev.png" alt="previous" />
      </div>

      <div class="menu-content">
        <MenuItem
          v-for="menu in pagedMenus"
          :key="menu.id"
          :item="menu"
          @select="onMenuClick"
        />
      </div>

      <div
        class="page-btn page-btn--next"
        :class="{ 'page-btn--hidden': currentPage === totalPages - 1 }"
        @click="onNext"
      >
        <ImageView src="/Image/menu/next.png" alt="next" />
      </div>
    </div>

    <div class="menu-pagination" v-if="totalPages > 1">
      <div class="page-dots">
        <span
          v-for="i in totalPages"
          :key="i"
          class="dot"
          :class="{ active: i - 1 === currentPage }"
        />
      </div>
    </div>

    <div class="menu-footer">
      <AppFooter
        :mode="FooterMode.Menu"
        v-model:currentLang="currentLang"
        :language-options="languageOptions"
        @call-staff="onCallStaff"
        @open-allergen="onOpenAllergen"
        @back="onBack"
      />
    </div>
  </div>

  <AllergenOverlay
    v-if="showAllergen"
    :currentLang="currentLang"
    @close="onCloseAllergen"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { FooterMode, Language } from '@/model/Enums';
import AppFooter from '@/component/common/AppFooter.vue';
import AllergenOverlay from '@/component/splash/AllergenOverlay.vue';
import { MenuListLogic } from '@/logic/page/MenuListLogic';
import MenuItem from '@/component/menu/MenuItem.vue';
import ImageView from '@/component/common/ImageView.vue';
import { MenuItem as MenuItemModel } from '@/model/Menu';

export default defineComponent({
  name: 'MenuList',
  components: {
    AppFooter,
    AllergenOverlay,
    MenuItem,
    ImageView,
  },
  setup() {
    const logic = new MenuListLogic();
    const currentLang = ref<Language>(Language.JA);
    const showAllergen = ref(false);
    const pageSize = 4;
    const currentPage = ref(0);

    const menus = ref<MenuItemModel[]>([]);

    const reloadMenus = () => {
      menus.value = logic.getMenuList;
    };
    reloadMenus();

    watch(currentLang, (lang) => {
      logic.changeLanguage(lang);
      currentPage.value = 0;
      reloadMenus();
    });

    watch(
      () => logic.currentCategoryCd,
      () => {
        currentPage.value = 0;
        reloadMenus();
      }
    );

    const totalPages = computed(() => Math.ceil(menus.value.length / pageSize));
    const categoryName = computed(() => logic.currentCategoryName);

    const onCallStaff = async () => {
      await logic.callStaff();
    };

    const pagedMenus = computed(() => {
      const start = currentPage.value * pageSize;
      return menus.value.slice(start, start + pageSize);
    });

    const onNext = () => {
      if (currentPage.value < totalPages.value - 1) {
        currentPage.value++;
      }
    };

    const onPrev = () => {
      if (currentPage.value > 0) {
        currentPage.value--;
      }
    };

    const onBack = async () => {
      await logic.onBackToCategory();
    };

    const onMenuClick = (menuCd: string) => {
      logic.goToMenuDetailPage(menuCd);
    };

    return {
      FooterMode,
      menus,
      currentLang,
      languageOptions: logic.languageOptions,
      showAllergen,
      onCallStaff,
      onOpenAllergen: () => (showAllergen.value = true),
      onCloseAllergen: () => (showAllergen.value = false),
      onBack,
      onMenuClick,
      totalPages,
      pagedMenus,
      onNext,
      onPrev,
      currentPage,
      categoryName,
    };
  },
});
</script>

<style>
.menu {
  display: flex;
  flex-direction: column;
}
.menu-header {
  height: 111px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-header-label {
  font-size: 70px;
  font-weight: 700;
  color: var(--text-link);
  text-align: center;

  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-content-menu-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.menu-content-menu-grid-item-name {
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-content {
  display: grid;
  grid-template-columns: repeat(2, 740px);
  grid-template-rows: repeat(2, 300px);
  gap: 27px;

  justify-content: center;
  align-content: center;
}

.menu-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 29px;
}

.page-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 45px;
  height: 136px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}

.page-btn--prev {
  left: 20px;
}

.page-btn--next {
  right: 20px;
}
.page-btn--hidden {
  visibility: hidden;
  pointer-events: none;
}

.page-dots {
  display: flex;
  gap: 18px;
}

.dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #d9d9d9;
}

.dot.active {
  background: var(--text-link);
}

.menu-pagination-wrapper {
  position: relative;
  width: 100%;
  height: 627px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-footer {
  margin-top: 111px;
}
</style>
