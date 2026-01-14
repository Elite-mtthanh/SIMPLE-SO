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

    <div class="footer-bar">
      <div class="footer-left">
        <DropdownButton v-model="currentLang" :items="languageOptions" type="soft" textColor="link"
          :icon="arrowDownIcon" @update:modelValue="onChangeLang">
          <template #label>
            <DictText keyName="LANGUAGE_BUTTON" />
          </template>
        </DropdownButton>

        <BaseButton type="primary" :icon="bellIcon" textColor="inverse" @confirm="onCallStaff">
          <DictText keyName="CALL_STAFF_BUTTON" />
        </BaseButton>

        <BaseButton :icon="alertIcon" type="soft" @confirm="onOpenAllergen">
          <DictText keyName="ALLERGEN_BUTTON" />
        </BaseButton>
      </div>

      <div class="footer-right">
        <div class="date">
          2024
          <DictText keyName="YEAR_LABEL" />
          12
          <DictText keyName="MONTH_LABEL" />
          03
          <DictText keyName="DAY_LABEL" />
        </div>
        <div class="time">10 : 00</div>
      </div>
    </div>
  </div>
  <AllergenOverlay v-if="showAllergen" @close="onCloseAllergen" />
</template>

<script lang="ts">
import { StartPageLogic } from '@/logic/page/StartPageLogic';
import { defineComponent, onMounted, ref } from 'vue';
import { Language, SplashType, type SplashConfig } from '@/model/Splash';
import SplashGuide from '@/component/splash/SplashGuide.vue';
import SplashAd from '@/component/splash/SplashAd.vue';
import BaseButton from '@/component/common/BaseButton.vue';
import DictText from '@/component/common/DictText.vue';
import bellIcon from '@/assets/Image/icon/bell-icon.png';
import alertIcon from '@/assets/Image/icon/fish-allergy-icon.png';
import arrowDownIcon from '@/assets/Image/icon/arrow-down-icon.png';
import DropdownButton from '@/component/common/DropdownButton.vue';
import AllergenOverlay from '@/component/splash/AllergenOverlay.vue';

export default defineComponent({
  name: 'splash-page',
  components: {
    SplashGuide,
    SplashAd,
    BaseButton,
    DictText,
    DropdownButton,
    AllergenOverlay
  },
  setup() {
    const logic = new StartPageLogic();
    const splashData = ref<SplashConfig | null>(null);
    const currentLang = ref<Language>(Language.JA);
    const showAllergen = ref(false);

    const onChangeLang = (lang: Language) => {
      logic.changeLanguage(lang);
    };

    onMounted(async () => {
      await logic.activate();
      splashData.value = logic.splashData!;
    });

    const onCallStaff = async () => {
      await logic.callStaff();
    };

    const onOpenAllergen = () => {
      showAllergen.value = true;
    };

    const onCloseAllergen = () => {
      showAllergen.value = false;
    };

    return {
      splashData,
      SplashType,
      bellIcon,
      alertIcon,
      DropdownButton,
      currentLang,
      arrowDownIcon,
      onChangeLang,
      languageOptions: logic.languageOptions,
      onCallStaff,
      showAllergen,
      onOpenAllergen,
      onCloseAllergen
    };
  },
});
</script>

<style>
.splash-guide-page {
  width: var(--display-resolution-width);
  height: var(--display-resolution-height);
  display: flex;
  flex-direction: column;
}

.desk-label {
  font-size: 200px;
  line-height: 18px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  margin-top: 20px;
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
}

.guide-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 50px;
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
  margin-top: 50px;
  padding: 40px;
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
