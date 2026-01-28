<template>
  <div class="overlay-mask" @mousedown.self.prevent="onMaskClick">
    <div class="overlay-mask-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PopupCommon',
  props: {
    closeOnMask: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const onMaskClick = () => {
      if (props.closeOnMask) {
        emit('close');
      }
    };

    return {
      onMaskClick,
    };
  },
});
</script>

<style scoped>
.overlay-mask {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-mask-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
