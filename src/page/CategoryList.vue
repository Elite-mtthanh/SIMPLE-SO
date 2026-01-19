<template>
  <div class="category-page">
    <header class="category-page-header">
      <span class="category-label">
        <DictText keyName="CATEGORY_LABEL" />
      </span>
    </header>

    <div class="category-content"></div>

    <AppFooter
      :mode="FooterMode.Splash"
      v-model:currentLang="currentLang"
      :language-options="languageOptions"
      :year="2024"
      :month="12"
      :day="3"
      time="10 : 00"
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
import { defineComponent, onMounted, ref, watch } from 'vue';
import { StartPageLogic } from '@/logic/page/StartPageLogic';
import { type SplashConfig } from '@/model/Splash';
import { FooterMode } from '@/model/Enums';
import DictText from '@/component/common/DictText.vue';
import AppFooter from '@/component/common/AppFooter.vue';
import AllergenOverlay from '@/component/splash/AllergenOverlay.vue';
import { SplashType, Language } from '@/model/Enums';

export default defineComponent({
  name: 'category-page',
  components: {
    DictText,
    AppFooter,
    AllergenOverlay,
  },
  setup() {
    const logic = new StartPageLogic();
    const splashData = ref<SplashConfig | null>(null);
    const currentLang = ref<Language>(Language.JA);
    const showAllergen = ref(false);

    onMounted(async () => {
      await logic.activate();
      splashData.value = logic.splashData!;
    });

    const onCallStaff = async () => {
      await logic.callStaff();
    };

    watch(currentLang, (lang) => {
      logic.changeLanguage(lang);
    });

    // const onOpenCart = async () => {
    //   await logic.openCart();
    // };

    return {
      splashData,
      SplashType,
      FooterMode,
      currentLang,
      languageOptions: logic.languageOptions,
      onCallStaff,
      showAllergen,
      onOpenAllergen: () => (showAllergen.value = true),
      onCloseAllergen: () => (showAllergen.value = false),
      // onOpenCart,
    };
  },
});
</script>

<style>
.category-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.category-page-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e0e0e0;
}
.category-label {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-link);
}
</style>
