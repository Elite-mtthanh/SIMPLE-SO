<template>
  <img :src="src" class="image-view" />
</template>

<script lang="ts">
export default {
  props: {
    src: { type: String, required: true },
    fit: {
      type: String as () => 'cover' | 'contain',
      default: 'cover',
    },
  },
};
</script>

<style scoped>
.image-view {
  width: 100%;
  height: 100%;
  object-fit: var(--fit);
}
</style>
