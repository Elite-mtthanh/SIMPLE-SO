<template>
  <div class="category">
    <header class="category-header">
      <span class="category-header-label">
        <DictText keyName="CATEGORY_LABEL" />
      </span>
    </header>

    <div class="category-content">
      <CategoryBlock
        v-for="category in categories"
        :key="category.id"
        :category="category"
        @select="onSelectCategory"
      />
    </div>

    <AppFooter
      :mode="FooterMode.Category"
      v-model:currentLang="currentLang"
      :language-options="languageOptions"
      @call-staff="onCallStaff"
      @open-allergen="onOpenAllergen"
    />
  </div>

  <AllergenOverlay
    v-if="showAllergen"
    :currentLang="currentLang"
    @close="onCloseAllergen"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { FooterMode, Language } from '@/model/Enums';
import DictText from '@/component/common/DictText.vue';
import AppFooter from '@/component/common/AppFooter.vue';
import AllergenOverlay from '@/component/splash/AllergenOverlay.vue';
import CategoryBlock from '@/component/category/CategoryBlock.vue';
import { CategoryListLogic } from '@/logic/page/CategoryListLogic';
import { Menu } from '@/model/Menu';

export default defineComponent({
  name: 'CategoryList',
  components: {
    DictText,
    AppFooter,
    AllergenOverlay,
    CategoryBlock,
  },
  setup() {
    const logic = new CategoryListLogic();
    const currentLang = ref<Language>(Language.JA);
    const showAllergen = ref(false);

    const categories = ref(logic.getCategoryList);

    watch(currentLang, (lang) => {
      logic.changeLanguage(lang);
      categories.value = logic.getCategoryList;
    });

    const onCallStaff = async () => {
      await logic.callStaff();
    };

    const onSelectCategory = async (category: Menu) => {
      await logic.goToMenuPage(category);
    };

    return {
      FooterMode,
      categories,
      currentLang,
      languageOptions: logic.languageOptions,
      showAllergen,
      onCallStaff,
      onOpenAllergen: () => (showAllergen.value = true),
      onCloseAllergen: () => (showAllergen.value = false),
      onSelectCategory
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

.category-content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px 16px;
  margin-bottom: 43px;
}
</style>
