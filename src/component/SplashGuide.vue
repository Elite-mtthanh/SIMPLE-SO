<template>
  <div class="splash-item">
    <div
      class="splash-item-step"
      v-for="(item, index) in splashGuideItems"
      :key="index"
    >
      <div class="splash-item-step-card">
        <div class="splash-item-step-card-image">
          <ImageView :src="item.image" alt="" />
        </div>
        <div class="splash-item-step-card-text">
          <span class="splash-item-step-card-text-inner">
            <DictText :keyName="item.key" />
          </span>
        </div>
      </div>

      <div
        v-if="index < splashGuideItems.length - 1"
        class="splash-item-step-arrow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 20 20"
        >
          <path
            fill="currentColor"
            d="M8.6 3.4L14.2 9H2v2h12.2l-5.6 5.6L10 18l8-8l-8-8z"
          />
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
import ImageView from '@/component/common/ImageView.vue';

export default defineComponent({
  name: 'SplashGuide',
  components: {
    DictText,
    ImageView,
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
.splash-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.splash-item-step {
  display: flex;
  align-items: center;
}

.splash-item-step-card {
  width: 250px;
  height: 300px;
  background-color: var(--background-items);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  text-align: center;
}

.splash-item-step-card img {
  width: 150px;
  height: 150px;
  object-fit: contain;
}

.splash-item-step-card-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.splash-item-step-card-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 97px;
  margin-top: 29px;
}

.splash-item-step-card-text-inner {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: var(--text-link);
  font-size: 30px;
  line-height: 35px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.splash-item-step-arrow {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-left: 6px;
  margin-right: 6px;
}
</style>
