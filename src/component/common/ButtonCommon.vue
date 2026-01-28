<template>
  <div
    ref="el"
    class="base-button"
    :class="[
      `bg-button-${type}`,
      { disabled, pressed, 'base-button-has-icon': !!icon },
    ]"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="onTouchStart"
    @mouseleave="onTouchMove"
    @mouseup="onTouchEnd"
  >
    <div
      v-if="icon && iconPosition === 'left'"
      class="base-button-side"
      :style="iconWrapperStyle"
    >
      <ImageView :src="icon" class="btn-icon" />
    </div>

    <span
      class="base-button-text"
      :class="[`text-${textColor}`, { 'center-text': !icon }]"
    >
      <slot v-if="!text" />
      <template v-else>{{ text }}</template>
    </span>

    <div
      v-if="icon && iconPosition === 'right'"
      class="base-button-side"
      :style="iconWrapperStyle"
    >
      <ImageView :src="icon" class="base-button-text-icon" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import ImageView from './ImageView.vue';

export default defineComponent({
  name: 'ButtonCommon',
  props: {
    type: { type: String, default: 'primary' },
    textColor: { type: String, default: 'primary' },
    disabled: { type: Boolean, default: false },
    id: { type: Number, default: 0 },
    text: { type: String, default: '' },
    icon: { type: String, default: '' },
    iconPosition: {
      type: String as () => 'left' | 'right',
      default: 'left',
    },
    iconSize: { type: Number, default: 24 },
  },
  components: { ImageView },
  emits: ['touchend'],
  setup(props, { emit }) {
    const el = ref<HTMLElement | null>(null);
    const pressed = ref(false);
    const active = ref(false);

    const isInside = (x: number, y: number) => {
      if (!el.value) return false;
      const rect = el.value.getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    };

    const onTouchStart = () => {
      if (props.disabled) return;
      active.value = true;
      pressed.value = true;
    };

    const onTouchMove = (e: TouchEvent | MouseEvent) => {
      if (!active.value) return;

      let x = 0;
      let y = 0;

      if (e instanceof TouchEvent) {
        const t = e.touches[0];
        if (!t) return;
        x = t.clientX;
        y = t.clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      pressed.value = isInside(x, y);
    };

    const onTouchEnd = (e: TouchEvent | MouseEvent) => {
      if (!active.value) return;

      let x = 0;
      let y = 0;

      if (e instanceof TouchEvent) {
        const t = e.changedTouches[0];
        if (!t) return;
        x = t.clientX;
        y = t.clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      const valid = isInside(x, y);

      active.value = false;
      pressed.value = false;

      if (valid) {
        emit('touchend', props.id);
      }
    };

    const iconWrapperStyle = computed(() => ({
      width: `${props.iconSize}px`,
      height: `${props.iconSize}px`,
    }));

    return {
      el,
      pressed,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      iconWrapperStyle,
    };
  },
});
</script>

<style>
.base-button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 300px;
  height: 90px;
  padding: 0 15px;

  border-radius: 6px;
  box-sizing: border-box;
}

.base-button-has-icon {
  justify-content: space-between;
}

.base-button-side {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.base-button-text {
  font-weight: 600;
  font-size: 30px;
  line-height: 18px;
  letter-spacing: 0%;
  text-align: right;
}

.base-button-text-icon {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.center-text {
  text-align: center;
}

.base-button.pressed {
  transform: scale(0.97);
  opacity: 0.85;
}

.base-button.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
