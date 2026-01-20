<template>
  <div class="splash-page" @click="onGoToCategory">
    <header class="splash-page-header">
      <span class="splash-page-header-desk-label">
        <DictText keyName="DESK_NUMBER_LABEL" /> : {{ splashData?.deskNumber }}
      </span>
    </header>

    <div class="splash-page-wrapper" @click.stop>
      <SplashGuide v-if="splashData?.splashType === SplashType.GUIDE" />
      <SplashAd v-else-if="splashData?.splashType === SplashType.SLIDESHOW" />
    </div>

    <div class="splash-page-hint-text">
      <DictText keyName="START_LABEL" />
    </div>

    <AppFooter
      @click.stop
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
import SplashGuide from '@/component/splash/SplashGuide.vue';
import SplashAd from '@/component/splash/SplashAd.vue';
import DictText from '@/component/common/DictText.vue';
import AppFooter from '@/component/common/AppFooter.vue';
import AllergenOverlay from '@/component/splash/AllergenOverlay.vue';
import { SplashType, Language } from '@/model/Enums';

export default defineComponent({
  name: 'splash-page',
  components: {
    SplashGuide,
    SplashAd,
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

    const onGoToCategory = async () => {
      await logic.goToCategoryPage();
    };

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
      onGoToCategory,
    };
  },
});
</script>

<style>
.splash-page {
  display: flex;
  flex-direction: column;
}

.splash-page-header {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  color: var(--text-link);
  font-weight: 700;
  margin-top: 40px;
}

.splash-page-header-desk-label {
  font-size: 200px;
  line-height: 18px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  color: var(--text-link);
}

.splash-page-wrapper {
  display: flex;
  justify-content: center;
}

.splash-page-hint-text {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: var(--text-accent);
  font-style: Semi Bold;
  font-size: 60px;
  line-height: 18px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  padding-top: 150px;
  padding-bottom: 50px;
}
</style>
