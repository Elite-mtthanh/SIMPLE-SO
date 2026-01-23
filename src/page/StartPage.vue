<template>
  <div class="splash-page" @click="onGoToCategory">
    <header class="splash-page-header">
      <span class="splash-page-header-desk-label">
        <DictTextCommon keyName="DESK_NUMBER_LABEL" /> :
        {{ splashData?.deskNumber }}
      </span>
    </header>

    <div class="splash-page-wrapper" @click.stop>
      <SplashGuide v-if="splashData?.splashType === SplashType.GUIDE" />
      <SplashAd v-else-if="splashData?.splashType === SplashType.SLIDESHOW" />
    </div>

    <div class="splash-page-hint-text">
      <DictTextCommon keyName="START_LABEL" />
    </div>

    <AppFooterCommon
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

  <AllergenDialog
    v-if="showAllergen"
    :currentLang="currentLang"
    @close="onCloseAllergen"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { StartPageLogic } from '@/logic/page/StartPageLogic';
import { FooterMode } from '@/model/Enums';
import SplashGuide from '@/component/SplashGuide.vue';
import SplashAd from '@/component/SplashAd.vue';
import DictTextCommon from '@/component/common/DictTextCommon.vue';
import AppFooterCommon from '@/component/common/AppFooterCommon.vue';
import AllergenDialog from '@/component/AllergenDialog.vue';
import { SplashType } from '@/model/Enums';

export default defineComponent({
  name: 'splash-page',
  components: {
    SplashGuide,
    SplashAd,
    DictTextCommon,
    AppFooterCommon,
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

      onCallStaff: logic.callStaff,
      onGoToCategory: logic.goToCategoryPage,
      onOpenAllergen: logic.openAllergen,
      onCloseAllergen: logic.closeAllergen,
      onChangeLang: logic.changeLanguage,
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
