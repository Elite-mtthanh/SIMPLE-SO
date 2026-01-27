<template>
  <div class="menu">
    <header class="menu-header">
      <span class="menu-header-label">
        {{ categoryName }}
      </span>
    </header>

    <div class="menu-pagination-wrapper">
      <div
        class="page-btn page-btn-prev"
        :class="{ 'page-btn-hidden': currentPage === 0 }"
        @click="onPrev"
      >
        <ImageViewCommon src="/Image/menu/prev.png" alt="previous" />
      </div>

      <div class="menu-content">
        <MenuItem
          v-for="menu in pagedMenus"
          :key="menu.id"
          :item="menu"
          @on-select="onMenuClick"
        />
      </div>

      <div
        class="page-btn page-btn-next"
        :class="{ 'page-btn-hidden': currentPage === totalPages - 1 }"
        @click="onNext"
      >
        <ImageViewCommon src="/Image/menu/next.png" alt="next" />
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
      <AppFooterCommon
        :mode="FooterMode.Menu"
        v-model:currentLang="currentLang"
        :language-options="languageOptions"
        :cartCount="footerLogic.cartCount"
        @on-open-cart="openOrderList"
        @on-call-staff="onCallStaff"
        @on-open-allergen="onOpenAllergen"
        @on-back="onBack"
      />
    </div>
  </div>

  <MenuDetailDialog
    v-if="selectedMenuCd"
    :menu-cd="selectedMenuCd"
    @close="selectedMenuCd = null"
  />

  <AllergenDialog
    v-if="showAllergen"
    :currentLang="currentLang"
    @close="onCloseAllergen"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { FooterMode } from '@/model/Enums';
import AllergenDialog from '@/component/AllergenDialog.vue';
import { MenuListLogic } from '@/logic/page/MenuListLogic';
import MenuItem from '@/component/MenuItem.vue';
import AppFooterCommon from '@/component/common/AppFooterCommon.vue';
import ImageViewCommon from '@/component/common/ImageViewCommon.vue';
import MenuDetailDialog from '@/component/MenuDetailDialog.vue';

export default defineComponent({
  name: 'MenuList',
  components: {
    AppFooterCommon,
    AllergenDialog,
    MenuItem,
    ImageViewCommon,
    MenuDetailDialog,
  },
  setup() {
    const logic = new MenuListLogic();
    const selectedMenuCd = ref<string | null>(null);

    return {
      FooterMode,

      currentLang: logic.currentLang,
      languageOptions: logic.languageOptions,
      showAllergen: logic.showAllergen,
      footerLogic: logic,

      categoryName: logic.categoryName,
      pagedMenus: logic.pagedMenus,
      totalPages: logic.totalPages,
      currentPage: logic.pageIndex,
      selectedMenuCd,

      onCallStaff: () => logic.callStaff(),
      onOpenAllergen: () => logic.openAllergen(),
      onCloseAllergen: () => logic.closeAllergen(),
      onNext: () => logic.nextPage(),
      onPrev: () => logic.prevPage(),
      onBack: () => logic.backToCategory(),
      openOrderList: () => logic.openOrderList(),
      onMenuClick: (menuCd: string) => {
        selectedMenuCd.value = menuCd;
      },
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

.page-btn-prev {
  left: 20px;
}

.page-btn-next {
  right: 20px;
}
.page-btn-hidden {
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
