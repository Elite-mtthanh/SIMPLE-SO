<template>
  <div class="dropdown-wrapper" :class="{ open: open }">
    <PressLayer @touchend="onMousedownToggle">
      <ButtonCommon
        :type="type"
        :textColor="textColor"
        :icon="icon"
        iconPosition="right"
        :iconSize="48"
        class="dropdown-wrapper-button"
      >
        <slot name="label" />
      </ButtonCommon>
    </PressLayer>

    <div
      v-show="open"
      ref="panelEl"
      class="dropdown-wrapper-panel anim-fade-scale"
    >
      <div
        v-for="item in items"
        :key="item.value"
        class="dropdown-wrapper-panel-item"
        :class="{ active: item.value === modelValue }"
        @mousedown.prevent="select(item.value)"
      >
        <span class="dropdown-wrapper-panel-item-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from 'vue';
import ButtonCommon from './ButtonCommon.vue';
import { playEnter, playLeave } from '@/util/AnimationUtil';
import PressLayer from './PressLayer.vue';
import { PageStack } from '@/model/PageStack';

export interface DropdownItem {
  label: string;
  value: number | string;
}

export default defineComponent({
  name: 'DropdownButton',
  components: { ButtonCommon, PressLayer },
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    items: {
      type: Array as () => DropdownItem[],
      required: true,
    },
    type: {
      type: String,
      default: 'soft',
    },
    textColor: {
      type: String,
      default: 'link',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const open = ref(false);
    const panelEl = ref<HTMLElement | null>(null);

    watch(
      () => open.value,
      (isOpen) => {
        if (isOpen) {
          nextTick(() => playEnter(panelEl));
        }
      }
    );

    watch(
      () => PageStack.Instance.currentPageName.value,
      () => {
        if (open.value) {
          open.value = false;
        }
      }
    );

    const closePanel = () => {
      playLeave(panelEl, 'anim-leave', 250, () => {
        open.value = false;
      });
    };

    const onMousedownToggle = () => {
      if (open.value) {
        closePanel();
      } else {
        open.value = true;
      }
    };

    const select = (value: string | number) => {
      emit('update:modelValue', value);
      closePanel();
    };

    return {
      open,
      panelEl,
      onMousedownToggle,
      select,
    };
  },
});
</script>
<style scoped>
.dropdown-wrapper {
  position: relative;
  border: 1px solid #475191;
  border-radius: 6px;
  z-index: var(--z-dropdown);
}

.dropdown-wrapper.open {
  border-radius: 0 0 6px 6px;
}

.dropdown-wrapper-button {
  padding: 0 21px 0 24px;
}

.dropdown-wrapper-panel {
  position: absolute;
  bottom: 100%;
  left: -1px;
  right: -1px;
  display: flex;
  flex-direction: column-reverse;
  overflow: hidden;
  border-radius: 6px 6px 0 0;
}

.dropdown-wrapper-panel-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  font-size: 20px;
  cursor: pointer;
  background: var(--btn-soft);
  transition: background 0.15s ease;
  color: var(--text-link);
  height: 90px;
  border: 1px solid #475191;
  border-top: none;
  gap: 8px;
  border-radius: 0;
}

.dropdown-wrapper-panel-item:first-child {
  border-radius: 0;
  border-top: 1px solid #475191;
}

.dropdown-wrapper-panel-item:last-child {
  border-radius: 6px 6px 0 0;
  border-top: 1px solid #475191;
}

.dropdown-wrapper-panel-item.active {
  background: var(--btn-active);
  font-weight: 700;
}

.dropdown-wrapper-panel-item-label {
  font-weight: 600;
  font-size: 30px;
  line-height: 18px;

  text-align: center;
  margin-left: 8px;
}
</style>
