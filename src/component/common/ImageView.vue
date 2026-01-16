<template>
  <div class="image-view">
    <img :src="src" :alt="alt" v-bind="$attrs" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ImageView',
  inheritAttrs: false,
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
  },
});
</script>

<style scoped>
.image-view {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-view img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
