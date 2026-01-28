<template>
  <div
    ref="el"
    class="press-layer"
    @touchstart.prevent="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend.prevent="onTouchEnd"
    @mousedown.prevent="onTouchStart"
    @mouseleave="onTouchMove"
    @mouseup="onTouchEnd"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PressLayer',
  emits: ['touchstart', 'touchmove', 'touchend'],
  setup(_, { emit }) {
    const el = ref<HTMLElement | null>(null);
    const active = ref(false);

    const isInside = (x: number, y: number) => {
      if (!el.value) return false;
      const rect = el.value.getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    };

    const getPoint = (e: TouchEvent | MouseEvent) => {
      if (e instanceof TouchEvent) {
        const t = e.touches[0] || e.changedTouches[0];
        if (!t) return null;
        return { x: t.clientX, y: t.clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };
    const onTouchStart = () => {
      active.value = true;
      emit('touchstart');
    };

    const onTouchMove = (e: TouchEvent | MouseEvent) => {
      if (!active.value) return;
      const p = getPoint(e);
      if (!p) return;

      const inside = isInside(p.x, p.y);
      emit('touchmove', inside);
    };

    const onTouchEnd = (e: TouchEvent | MouseEvent) => {
      if (!active.value) return;
      const p = getPoint(e);
      active.value = false;

      if (p && isInside(p.x, p.y)) {
        emit('touchend');
      }
    };

    return {
      el,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    };
  },
});
</script>

<style scoped>
.press-layer {
  display: block;
}
</style>
