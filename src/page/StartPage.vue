<template>
  <div ref="pageEl" class="splash-page anim-fade-scale">
    <div class="splash-page-content">
      <PressLayer @touchend="onGoToCategory">
        <header class="splash-page-header">
          <span class="splash-page-header-desk-label">
            <DictText keyName="DESK_NUMBER_LABEL" /> :
            {{ splashData?.deskNumber }}
          </span>
        </header>
      </PressLayer>
      <div class="splash-page-guide">
        <SplashGuide v-if="splashData?.splashType === SplashType.GUIDE" />
        <SplashAd v-else-if="splashData?.splashType === SplashType.SLIDESHOW" />
      </div>

      <PressLayer @touchend="onGoToCategory">
        <div class="splash-page-hint-text">
          <DictText keyName="START_LABEL" />
        </div>
      </PressLayer>
    </div>
  </div>

  <AppFooter
    :mode="FooterMode.Splash"
    :currentLang="currentLang"
    :language-options="languageOptions"
    @update:currentLang="onChangeLang"
    @on-call-staff="onCallStaff"
    @on-open-allergen="onOpenAllergen"
  />

  <AllergenDialog
    v-if="showAllergen"
    :currentLang="currentLang"
    @on-close="onCloseAllergen"
  />
</template>

<script lang="ts">
import { defineComponent, onActivated, onMounted, ref } from 'vue';
import { StartPageLogic } from '@/logic/page/StartPageLogic';

import SplashGuide from '@/component/SplashGuide.vue';
import SplashAd from '@/component/SplashAd.vue';
import DictText from '@/component/common/DictText.vue';
import AppFooter from '@/component/common/AppFooter.vue';
import AllergenDialog from '@/component/AllergenDialog.vue';
import PressLayer from '@/component/common/PressLayer.vue';
import { playEnter } from '@/util/AnimationUtil';

import { FooterMode, Language, SplashType } from '@/model/Enums';

export default defineComponent({
  name: 'SplashPage',
  components: {
    SplashGuide,
    SplashAd,
    DictText,
    AppFooter,
    AllergenDialog,
    PressLayer,
  },
  setup() {
    const pageEl = ref<HTMLElement | null>(null);
    const logic = new StartPageLogic();

    const triggerEnterAnimation = () => playEnter(pageEl);
    onMounted(async () => {
      triggerEnterAnimation();
      await logic.activate();
    });
    onActivated(triggerEnterAnimation);

    return {
      pageEl,
      splashData: logic.splashData,
      currentLang: logic.currentLang,
      showAllergen: logic.showAllergen,
      languageOptions: logic.languageOptions,

      SplashType,
      FooterMode,

      onCallStaff: () => logic.callStaff(),
      onGoToCategory: () => logic.goToCategoryPage(),
      onOpenAllergen: () => logic.openAllergen(),
      onCloseAllergen: () => logic.closeAllergen(),
      onChangeLang: (lang: Language) => logic.changeLanguage(lang),
    };
  },
});
</script>

<style>
.splash-page {
  display: flex;
  flex-direction: column;
}

.splash-page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.splash-page-header {
  width: 1615px;
  height: 272px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 36px 15px 29px;
}

.splash-page-header-desk-label {
  color: var(--text-link);
  font-weight: 600;
  font-size: 200px;
  line-height: 18px;
  text-align: center;
  vertical-align: middle;
}

.splash-page-guide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.splash-page-hint-text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 123px;
  width: 1585px;
  font-size: 60px;
  line-height: 18px;
  font-weight: 600;
  color: var(--text-error);
  font-style: Semi Bold;
  margin-top: 133px;
  margin-bottom: 44px;
}
</style>
