<template>
  <div class="splash-guide-page">
    <header class="start-page-header">
      <span class="desk-label">
        <DictText keyName="DESK_NUMBER_LABEL" /> : {{ splashData?.deskNumber }}
      </span>
    </header>

    <div class="guide-wrapper">
      <SplashGuide v-if="splashData?.splashType === SplashType.GUIDE" />
      <SplashAd v-else-if="splashData?.splashType === SplashType.SLIDESHOW" />
    </div>

    <div class="hint-text">
      <DictText keyName="START_LABEL" />
    </div>

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
import { FooterMode } from '@/model/enums';
import SplashGuide from '@/component/splash/SplashGuide.vue';
import SplashAd from '@/component/splash/SplashAd.vue';
import DictText from '@/component/common/DictText.vue';
import AppFooter from '@/component/common/AppFooter.vue';
import AllergenOverlay from '@/component/splash/AllergenOverlay.vue';
import { SplashType, Language } from '@/model/enums';

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
    };
  },
});
</script>

<style>
.splash-guide-page {
  display: flex;
  flex-direction: column;
}

.desk-label {
  font-size: 200px;
  line-height: 18px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  color: var(--text-link);
}

.start-page-header {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  color: var(--text-link);
  font-weight: 700;
  margin-top: 40px;
}

.guide-wrapper {
  display: flex;
  justify-content: center;
}

.hint-text {
  margin-top: 150px;
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
}

.footer-bar {
  padding-top: 45px;
  padding-left: 60px;
  padding-right: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-left {
  display: flex;
  gap: 20px;
  align-items: center;
}

.footer-right {
  text-align: right;
  color: var(--text-link);
  font-weight: 600;
}

.footer-right .date {
  font-size: 20px;
}

.footer-right .time {
  font-size: 28px;
}
</style>
