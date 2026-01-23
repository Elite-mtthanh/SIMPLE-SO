<template>
  <div class="footer">
    <div class="footer-left">
      <div v-if="showBack" class="footer-left-back-icon">
        <ImageViewCommon :src="backIcon" @click="onBack" />
      </div>

      <DropdownButtonCommon
        v-model="localLang"
        :items="languageOptions"
        type="soft"
        textColor="link"
        :icon="arrowDownIcon"
        @update:modelValue="onChangeLang"
      >
        <template #label>
          <DictTextCommon keyName="LANGUAGE_BUTTON" />
        </template>
      </DropdownButtonCommon>

      <ButtonCommon
        type="primary"
        :icon="bellIcon"
        textColor="inverse"
        @confirm="onCallStaff"
        :iconSize="48"
      >
        <DictTextCommon keyName="CALL_STAFF_BUTTON" />
      </ButtonCommon>

      <ButtonCommon
        type="soft"
        :icon="allergenIcon"
        textColor="link"
        @confirm="onOpenAllergen"
        :iconSize="79"
      >
        <DictTextCommon keyName="ALLERGEN_BUTTON" />
      </ButtonCommon>
    </div>

    <div class="footer-right">
      <ButtonCommon
        v-if="showCart"
        :type="cartCount === 0 ? 'neutral' : 'accent'"
        :icon="cartIcon"
        textColor="inverse"
        @confirm="onOpenCart"
        :iconSize="50"
        class="footer-right-cart"
        :disabled="cartCount === 0"
      >
        <span class="footer-right-cart-badge"> +{{ cartCount }} </span>
      </ButtonCommon>
      <div>
        <div class="footer-right-date">
          {{ year }}
          <DictTextCommon keyName="YEAR_LABEL" />
          {{ month }}
          <DictTextCommon keyName="MONTH_LABEL" />
          {{ day }}
          <DictTextCommon keyName="DAY_LABEL" />
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
import DropdownButtonCommon from '@/component/common/DropdownButtonCommon.vue';
import DictTextCommon from '@/component/common/DictTextCommon.vue';
import bellIcon from '@/assets/Image/icon/bell-icon.png';
import allergenIcon from '@/assets/Image/icon/allergen-icon.png';
import arrowDownIcon from '@/assets/Image/icon/arrow-down-icon.png';
import backIcon from '@/assets/Image/icon/back-icon.png';
import cartIcon from '@/assets/Image/icon/cart-icon.png';
import ImageViewCommon from './ImageViewCommon.vue';

export default defineComponent({
  name: 'AppFooterCommon',
  components: {
    ButtonCommon,
    DropdownButtonCommon,
    DictTextCommon,
    ImageViewCommon,
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

    const year = ref(0);
    const month = ref(0);
    const day = ref(0);
    const time = ref('');

    let timer: number | undefined;

    const updateDateTime = () => {
      const now = new Date();

      year.value = now.getFullYear();
      month.value = now.getMonth() + 1;
      day.value = now.getDate();

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

    const onCallStaff = () => {
      emit('on-call-staff');
    };

    const onOpenAllergen = () => {
      emit('on-open-allergen');
    };

    const onOpenCart = () => {
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
      onCallStaff,
      onOpenAllergen,
      onOpenCart,
    };
  },
});
</script>

<style scoped>
.footer {
  padding-left: 50px;
  padding-right: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-left {
  display: flex;
  gap: 20px;
  align-items: center;
}

.footer-left-back-icon {
  cursor: pointer;
  height: 70px;
  width: 70px;
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
}

.footer-right-cart-badge {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 286px;
  pointer-events: none;
  font-size: 45px;
  color: var(--text-inverse);
}
</style>
