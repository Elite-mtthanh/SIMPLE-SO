<template>
  <div class="item-splash">
    <ImageView :src="image" alt="" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import splashAd from '@/assets/Image/guide/splash-ad.png';
import ImageView from '@/component/common/ImageView.vue';

export default defineComponent({
  name: 'splashAd',
  components: {
    ImageView,
  },
  setup() {
    const image = splashAd;
    return { image };
  },
});
</script>

<style scoped>
.item-splash {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 1379px;
  height: 337px;
}
</style>
