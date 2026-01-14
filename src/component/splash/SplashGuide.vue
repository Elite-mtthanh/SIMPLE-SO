<template>
  <div class="item-splash">
    <div class="splash-step" v-for="(item, index) in splashGuideItems" :key="index">
      <div class="step-card">
        <img :src="item.image" alt="" />
        <DictText :keyName="item.key" class="splash-text" />
      </div>

      <div v-if="index < splashGuideItems.length - 1" class="step-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20">
          <path fill="currentColor" d="M8.6 3.4L14.2 9H2v2h12.2l-5.6 5.6L10 18l8-8l-8-8z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DictText from '@/component/common/DictText.vue';
import phoneIcon from '@/assets/Image/guide/phone-guide-icon.png';
import cartIcon from '@/assets/Image/guide/cart-guide-icon.png';
import reviewIcon from '@/assets/Image/guide/review-guide-icon.png';
import addIcon from '@/assets/Image/guide/add-guide-icon.png';
import creditCardIcon from '@/assets/Image/guide/creditcard-guide-icon.png';

export default defineComponent({
  name: 'SplashGuide',
  components: {
    DictText,
  },
  setup() {
    const splashGuideItems = [
      { image: phoneIcon, key: 'GUIDE_1_LABEL' },
      { image: cartIcon, key: 'GUIDE_2_LABEL' },
      { image: reviewIcon, key: 'GUIDE_3_LABEL' },
      { image: addIcon, key: 'GUIDE_4_LABEL' },
      { image: creditCardIcon, key: 'GUIDE_5_LABEL' },
    ];

    return {
      splashGuideItems,
    };
  },
});
</script>


<style scoped>
.item-splash {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
}

.splash-step {
  display: flex;
  align-items: center;
}

.step-card {
  width: 250px;
  height: 300px;
  background-color: #d8ebe3;
  border-radius: 12px;
  border-radius: 6px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

.step-card img {
  width: 150px;
  height: 150px;
  object-fit: contain;
  margin-bottom: 20px;
}

.splash-text {
  color: var(--text-link);
  font-size: 30px;
  line-height: 35px;
  text-align: center;
  vertical-align: middle;
  padding: 0 14px;
}

.step-arrow {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 10px;
}
</style>
