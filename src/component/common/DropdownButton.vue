<template>
  <div class="dropdown-wrapper">
    <ButtonCommon
      :type="type"
      :textColor="textColor"
      :icon="icon"
      iconPosition="right"
      @touchend="onMousedownToggle"
    >
      <slot name="label" />
    </ButtonCommon>

    <div v-if="open" class="dropdown-wrapper-panel">
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
import { defineComponent, ref } from 'vue';
import ButtonCommon from './ButtonCommon.vue';

export interface DropdownItem {
  label: string;
  value: number | string;
}

export default defineComponent({
  name: 'DropdownButton',
  components: { ButtonCommon },
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

    const onMousedownToggle = () => {
      open.value = !open.value;
    };

    const select = (value: string | number) => {
      emit('update:modelValue', value);
      open.value = false;
    };

    return {
      open,
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
}

.dropdown-wrapper-panel {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
}

.dropdown-wrapper-panel-item {
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 16px;
  font-size: 20px;
  cursor: pointer;
  background: var(--btn-soft);
  transition: background 0.15s ease;
  color: var(--text-link);
  height: 90px;
  border: 1px solid #475197;
  width: 300px;
  gap: 8px;
}

.dropdown-wrapper-panel-item.active {
  background: var(--btn-active);
  font-weight: 700;
}

.dropdown-wrapper-panel-item-label {
  font-weight: 600;
  font-size: 30px;
  line-height: 18px;
  letter-spacing: 0%;
  text-align: center;
  margin-left: 8px;
}
</style>
