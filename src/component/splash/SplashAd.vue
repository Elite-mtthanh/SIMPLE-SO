<template>
  <div class="item-splash">
    <img :src="image" alt="" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import splashAd from '@/assets/Image/guide/splash-ad.png';

export default defineComponent({
  name: 'splash-ad',
  setup() {
    const image = splashAd;
    return { image };
  },
});
</script>
