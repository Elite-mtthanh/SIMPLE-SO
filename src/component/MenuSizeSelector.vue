<template>
  <div class="menu-size-group" v-if="sizes.length">
    <button
      v-for="size in sizes"
      :key="size.select_cd"
      class="menu-size-item"
      :class="{
        'menu-size-item-active': selectedSize?.select_cd === size.select_cd,
      }"
      @click="onSelectSize(size)"
    >
      {{ size.select_name1 }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { MenuSelect } from '@/model/Menu';

export default defineComponent({
  name: 'MenuSizeSelector',
  props: {
    sizes: {
      type: Array as PropType<MenuSelect[]>,
      required: true,
    },
    selectedSize: {
      type: Object as PropType<MenuSelect | null>,
      default: null,
    },
  },
  emits: ['on-select'],
  setup(props, { emit }) {
    const onSelectSize = (size: MenuSelect) => {
      emit('on-select', size);
    };

    return {
      onSelectSize,
    };
  },
});
</script>

<style scoped>
.menu-size-group {
  display: flex;
  gap: 24px;
}

.menu-size-item {
  width: 80px;
  height: 80px;
  background: #e0e0e0;
  border: 1px solid #9e9e9e;
  font-size: 45px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}

.menu-size-item-active {
  background: #4b57a3;
  color: #fff;
  border-color: #4b57a3;
}
</style>