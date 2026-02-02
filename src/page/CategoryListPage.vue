<template>
  <div class="category">
    <header class="category-header">
      <span class="category-header-label">
        <DictText keyName="CATEGORY_LABEL" />
      </span>
    </header>

    <div class="category-content-wrapper">
      <div class="category-content">
        <CategoryItem
          v-for="category in categories"
          :key="category.id"
          :category="category"
          @select="onSelectCategory"
        />
      </div>
    </div>

    <AppFooter
      :mode="FooterMode.Category"
      v-model:currentLang="currentLang"
      :language-options="languageOptions"
      :cartCount="cartCount"
      @on-open-cart="openOrderList"
      @on-call-staff="onCallStaff"
      @on-open-allergen="onOpenAllergen"
    />
  </div>

  <Transition name="fade">
    <AllergenDialog
      v-if="showAllergen"
      :currentLang="currentLang"
      @on-close="onCloseAllergen"
    />
  </Transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { FooterMode, Language } from '@/model/Enums';
import DictText from '@/component/common/DictText.vue';
import AppFooter from '@/component/common/AppFooter.vue';
import CategoryItem from '@/component/CategoryItem.vue';
import { CategoryListPageLogic } from '@/logic/page/CategoryListPageLogic';
import AllergenDialog from '@/component/AllergenDialog.vue';

export default defineComponent({
  name: 'CategoryList',
  components: {
    DictText,
    AppFooter,
    AllergenDialog,
    CategoryItem,
  },
  setup() {
    const logic = new CategoryListPageLogic();
    const cartCount = computed(() => logic.cartCount.value);

    return {
      FooterMode,
      categories: logic.categoryList,
      currentLang: logic.currentLang,
      showAllergen: logic.showAllergen,
      languageOptions: logic.languageOptions,
      footerLogic: logic,
      cartCount,
      onCallStaff: () => logic.callStaff(),
      onOpenAllergen: () => logic.openAllergen(),
      onCloseAllergen: () => logic.closeAllergen(),
      onSelectCategory: (category: any) => logic.goToMenuPage(category),
      onChangeLang: (lang: Language) => logic.changeLanguage(lang),
      openOrderList: () => logic.openOrderList(),
    };
  },
});
</script>

<style>
.category {
  display: flex;
  flex-direction: column;
}
.category-header {
  width: 1677px;
  height: 107px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.category-header-label {
  font-size: 70px;
  font-weight: 700;
  color: var(--text-link);
}

.category-content-menu-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.category-content-menu-grid-item-name {
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-content-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 43px;
}

.category-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 17px 20px;
  width: 1580px;
}
</style>
