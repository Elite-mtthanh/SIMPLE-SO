<template>
  <div class="category">
    <header class="category-header">
      <span class="category-header-label">
        <DictTextCommon keyName="CATEGORY_LABEL" />
      </span>
    </header>

    <div class="category-content">
      <CategoryItem
        v-for="category in categories"
        :key="category.id"
        :category="category"
        @select="onSelectCategory"
      />
    </div>

    <AppFooterCommon
      :mode="FooterMode.Category"
      v-model:currentLang="currentLang"
      :language-options="languageOptions"
      @on-call-staff="onCallStaff"
      @on-open-allergen="onOpenAllergen"
    />
  </div>

  <AllergenDialog
    v-if="showAllergen"
    :currentLang="currentLang"
    @close="onCloseAllergen"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FooterMode, Language } from '@/model/Enums';
import DictTextCommon from '@/component/common/DictTextCommon.vue';
import AppFooterCommon from '@/component/common/AppFooterCommon.vue';
import CategoryItem from '@/component/CategoryItem.vue';
import { CategoryListLogic } from '@/logic/page/CategoryListLogic';
import AllergenDialog from '@/component/AllergenDialog.vue';

export default defineComponent({
  name: 'CategoryList',
  components: {
    DictTextCommon,
    AppFooterCommon,
    AllergenDialog,
    CategoryItem,
  },
  setup() {
    const logic = new CategoryListLogic();

    return {
      FooterMode,
      categories: logic.categoryList,
      currentLang: logic.currentLang,
      showAllergen: logic.showAllergen,
      languageOptions: logic.languageOptions,

      onCallStaff: () => logic.callStaff(),
      onOpenAllergen: () => logic.openAllergen(),
      onCloseAllergen: () => logic.closeAllergen(),
      onSelectCategory: (category: any) => logic.goToMenuPage(category),
      onChangeLang: (lang: Language) => logic.changeLanguage(lang),
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
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0;
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

.category-content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px 16px;
}
</style>
