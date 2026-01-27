<template>
  <div class="splash-page" @mousedown.prevent="onGoToCategory">
    <header class="splash-page-header">
      <span class="splash-page-header-desk-label">
        <DictText keyName="DESK_NUMBER_LABEL" /> :
        {{ splashData?.deskNumber }}
      </span>
    </header>

    <div class="splash-page-guide" @mousedown.stop.prevent>
      <SplashGuide v-if="splashData?.splashType === SplashType.GUIDE" />
      <SplashAd v-else-if="splashData?.splashType === SplashType.SLIDESHOW" />
    </div>

    <div class="splash-page-hint-text">
      <DictText keyName="START_LABEL" />
    </div>

    <AppFooter
      @mousedown.stop.prevent
      :mode="FooterMode.Splash"
      v-model:currentLang="currentLang"
      :language-options="languageOptions"
      :year="2024"
      :month="12"
      :day="3"
      time="10 : 00"
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
import { defineComponent, onMounted } from 'vue';
import { StartPageLogic } from '@/logic/page/StartPageLogic';
import { FooterMode, Language } from '@/model/Enums';
import SplashGuide from '@/component/SplashGuide.vue';
import SplashAd from '@/component/SplashAd.vue';
import DictText from '@/component/common/DictText.vue';
import AppFooter from '@/component/common/AppFooter.vue';
import AllergenDialog from '@/component/AllergenDialog.vue';
import { SplashType } from '@/model/Enums';

export default defineComponent({
  name: 'splash-page',
  components: {
    SplashGuide,
    SplashAd,
    DictText,
    AppFooter,
    AllergenDialog,
  },
  setup() {
    const logic = new StartPageLogic();

    onMounted(async () => {
      await logic.activate();
    });

    return {
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

.splash-page-header {
  height: 1615px;
  height: 272px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 20px 0;
}

.splash-page-header-desk-label {
  color: var(--text-link);
  font-weight: 600;
  font-size: 200px;
  line-height: 18px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
}

.splash-page-guide {
  display: flex;
  justify-content: center;
  align-items: center;
}

.splash-page-hint-text {
  height: 132px;
  width: 1585px;
  font-size: 60px;
  line-height: 18px;
  text-align: center;
  font-weight: 600;
  vertical-align: middle;
  color: var(--text-error);
  font-style: Semi Bold;
  margin-top: 133px;
  margin-bottom: 44px;
}
</style>
