<template>
  <div class="image-view">
    <img :src="src" :alt="alt" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ImageView',
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
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
