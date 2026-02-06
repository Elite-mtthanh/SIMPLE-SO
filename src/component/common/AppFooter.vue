<template>
  <div class="footer">
    <div class="footer-left">
      <div v-if="showBack" class="footer-left-back-icon">
        <PressLayer @touchend="onBack">
          <ImageView :src="backIcon" />
        </PressLayer>
      </div>

      <div class="footer-left-buttons">
        <DropdownButtonCommon
          v-model="localLang"
          :items="languageOptions"
          type="soft"
          textColor="link"
          :icon="arrowDownIcon"
          @update:modelValue="onChangeLang"
        >
          <template #label>
            <DictText keyName="LANGUAGE_BUTTON" />
          </template>
        </DropdownButtonCommon>

        <ButtonCommon
          type="primary"
          :icon="bellIcon"
          textColor="inverse"
          @touchend="onMousedownCallStaff"
          :iconSize="48"
          class="footer-left-bell"
        >
          <span class="footer-left-bell-badge">
            <DictText keyName="CALL_STAFF_BUTTON" />
          </span>
        </ButtonCommon>

        <ButtonCommon
          type="soft"
          :icon="allergenIcon"
          textColor="link"
          @touchend="onMousedownOpenAllergen"
          :iconHeight="75"
          :iconWidth="79"
          class="footer-left-allergen"
        >
          <DictText keyName="ALLERGEN_BUTTON" />
        </ButtonCommon>
      </div>
    </div>

    <div class="footer-right">
      <PressLayer @touchend="onMousedownOpenCart">
        <ButtonCommon
          v-if="showCart"
          :type="cartCount === 0 ? 'neutral' : 'accent'"
          :icon="cartIcon"
          textColor="inverse"
          :iconSize="70"
          class="footer-right-cart"
          :disabled="cartCount === 0"
        >
          <span class="footer-right-cart-badge">
            {{ displayCartCount }}
          </span>
        </ButtonCommon>
      </PressLayer>

      <div>
        <div class="footer-right-date">
          {{ year }}
          <DictText keyName="YEAR_LABEL" />
          {{ month }}
          <DictText keyName="MONTH_LABEL" />
          {{ day }}
          <DictText keyName="DAY_LABEL" />
        </div>
        <div class="footer-right-time">{{ time }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch,
  onMounted,
  onUnmounted,
} from 'vue';
import { FooterMode, Language } from '@/model/Enums';
import ButtonCommon from '@/component/common/ButtonCommon.vue';
import DropdownButtonCommon from '@/component/common/DropdownButton.vue';
import DictText from '@/component/common/DictText.vue';
import bellIcon from '@/assets/Image/icon/bell-icon.png';
import allergenIcon from '@/assets/Image/icon/allergen-icon.png';
import arrowDownIcon from '@/assets/Image/icon/arrow-down-icon.png';
import backIcon from '@/assets/Image/icon/back-icon.png';
import cartIcon from '@/assets/Image/icon/cart-icon.png';
import ImageView from './ImageView.vue';
import PressLayer from './PressLayer.vue';

export default defineComponent({
  name: 'AppFooter',
  components: {
    ButtonCommon,
    DropdownButtonCommon,
    DictText,
    ImageView,
    PressLayer,
  },
  props: {
    mode: {
      type: String as PropType<FooterMode>,
      required: true,
    },
    currentLang: {
      type: String as unknown as PropType<Language>,
      required: true,
    },
    languageOptions: {
      type: Array as PropType<{ label: string; value: Language }[]>,
      required: true,
    },
    cartCount: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    'update:currentLang',
    'on-back',
    'on-call-staff',
    'on-open-allergen',
    'on-open-cart',
  ],
  setup(props, { emit }) {
    const localLang = ref(props.currentLang);

    watch(
      () => props.currentLang,
      (val) => {
        localLang.value = val;
      }
    );
    const year = ref<number | string>(0);
    const month = ref('');
    const day = ref('');
    const time = ref('');

    let timer: number | undefined;

    const updateDateTime = () => {
      const now = new Date();

      year.value = now.getFullYear();
      month.value = String(now.getMonth() + 1).padStart(2, '0');
      day.value = String(now.getDate()).padStart(2, '0');

      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      time.value = `${h} : ${m}`;
    };

    onMounted(() => {
      updateDateTime();
      timer = window.setInterval(updateDateTime, 60 * 1000);
    });

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer);
      }
    });

    const displayCartCount = computed(() => {
      if (props.cartCount <= 0) return '+0';
      return props.cartCount > 99 ? '99+' : `+${props.cartCount}`;
    });

    const showBack = computed(() => props.mode === FooterMode.Menu);

    const showCart = computed(
      () => props.mode === FooterMode.Category || props.mode === FooterMode.Menu
    );

    const onChangeLang = (lang: Language) => {
      localLang.value = lang;
      emit('update:currentLang', lang);
    };

    const onBack = () => {
      emit('on-back');
    };

    const onMousedownCallStaff = () => {
      emit('on-call-staff');
    };

    const onMousedownOpenAllergen = () => {
      emit('on-open-allergen');
    };

    const onMousedownOpenCart = () => {
      emit('on-open-cart');
    };

    return {
      localLang,
      showBack,
      showCart,
      onChangeLang,
      bellIcon,
      allergenIcon,
      arrowDownIcon,
      backIcon,
      cartIcon,
      year,
      month,
      day,
      time,
      onBack,
      displayCartCount,
      onMousedownCallStaff,
      onMousedownOpenAllergen,
      onMousedownOpenCart,
    };
  },
});
</script>

<style scoped>
.footer {
  padding-left: 51px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-left {
  display: flex;
  align-items: center;
}

.footer-left-buttons {
  display: flex;
  align-items: center;
  gap: 27px;
}

.footer-left-back-icon {
  cursor: pointer;
  height: 90px;
  width: 90px;
  margin-right: 22px;
}

.footer-right {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-link);
  font-weight: 600;
  font-size: 30px;
  line-height: 18px;
}

.footer-right-date {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 43px;
  width: 286px;
}

.footer-right-time {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  width: 286px;
  font-weight: 600;
  font-size: 50px;
  line-height: 18px;
}

.footer-right-cart {
  position: relative;
  width: 240px;
  height: 89px;
  padding: 10px 0 9px 12px;
  gap: 9px;
}

:deep(.footer-right-cart) {
  justify-content: flex-start !important;
}

.footer-right-cart :deep(.base-button-has-icon) {
  justify-content: flex-start !important;
}

.footer-right-cart-badge {
  display: flex;
  align-items: center;
  color: var(--text-inverse);
  font-weight: 600;
  font-size: 70px;
  line-height: 18px;
  letter-spacing: 0%;
  height: 88px;
  width: 137px;
}

.footer-left-bell {
  padding: 0 24px 0 23px;
}

.footer-left-bell-badge {
  width: 180px;
  height: 18px;
}

.footer-left-allergen {
  padding-right: 24px;
  border: 1px solid #475191;
}
</style>
