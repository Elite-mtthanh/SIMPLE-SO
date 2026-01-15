<template>
  <div class="footer-bar">
    <div class="footer-left">
      <BaseButton
        v-if="showBack"
        type="soft"
        :icon="backIcon"
        @confirm="$emit('back')"
      />

      <DropdownButton
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
      </DropdownButton>

      <BaseButton
        type="primary"
        :icon="bellIcon"
        textColor="inverse"
        @confirm="$emit('call-staff')"
      >
        <DictText keyName="CALL_STAFF_BUTTON" />
      </BaseButton>

      <BaseButton
        type="soft"
        :icon="allergenIcon"
        textColor="link"
        @confirm="$emit('open-allergen')"
      >
        <DictText keyName="ALLERGEN_BUTTON" />
      </BaseButton>
    </div>

    <div class="footer-right">
      <BaseButton
        v-if="showCart"
        type="primary"
        :icon="cartIcon"
        textColor="inverse"
        @confirm="$emit('open-cart')"
      >
        <span class="cart-text">
          <DictText keyName="CART_BUTTON" />
          <span v-if="cartCount > 0" class="cart-badge">
            +{{ cartCount }}
          </span>
        </span>
      </BaseButton>

      <div class="date-time">
        <div class="date">
          {{ year }}
          <DictText keyName="YEAR_LABEL" />
          {{ month }}
          <DictText keyName="MONTH_LABEL" />
          {{ day }}
          <DictText keyName="DAY_LABEL" />
        </div>
        <div class="time">{{ time }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch, onMounted, onUnmounted, } from 'vue';
import { FooterMode, Language } from '@/model/enums';
import BaseButton from '@/component/common/BaseButton.vue';
import DropdownButton from '@/component/common/DropdownButton.vue';
import DictText from '@/component/common/DictText.vue';
import bellIcon from '@/assets/Image/icon/bell-icon.png';
import allergenIcon from '@/assets/Image/icon/allergen-icon.png';
import arrowDownIcon from '@/assets/Image/icon/arrow-down-icon.png';
import backIcon from '@/assets/Image/icon/back-icon.png';
import cartIcon from '@/assets/Image/icon/cart-icon.png';

export default defineComponent({
  name: 'AppFooter',
  components: {
    BaseButton,
    DropdownButton,
    DictText,
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
    'back',
    'call-staff',
    'open-allergen',
    'open-cart',
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

    const showBack = computed(() => props.mode === FooterMode.Category);

    const showCart = computed(
      () =>
        props.mode === FooterMode.Category || props.mode === FooterMode.Order
    );

    const onChangeLang = (lang: Language) => {
      localLang.value = lang;
      emit('update:currentLang', lang);
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
    };
  },
});
</script>

<style scoped>
.footer-bar {
  margin-top: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  display: flex;
  gap: 20px;
  align-items: center;
}

.footer-right {
  display: flex;
  gap: 24px;
  align-items: center;
  text-align: right;
  color: var(--text-link);
  font-weight: 600;
}

.date {
  font-size: 20px;
}

.time {
  font-size: 28px;
  text-align: center;
}

.cart-badge {
  margin-left: 8px;
  padding: 2px 8px;
  background: var(--color-danger);
  color: #fff;
  border-radius: 12px;
  font-size: 14px;
}
</style>
