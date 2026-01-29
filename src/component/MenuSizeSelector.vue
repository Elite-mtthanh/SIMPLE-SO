<template>
  <div class="menu-size-group" v-if="sizes.length">
    <ButtonCommon
      v-for="size in sizes"
      :key="size.select_cd"
      class="menu-size-item"
      @touchend="onSelectSize(size)"
      :type="selectedSize?.select_cd === size.select_cd ? 'link' : 'gray'"
      :text-color="
        selectedSize?.select_cd === size.select_cd ? 'inverse' : 'primary'
      "
    >
      <span class="menu-size-item-name">{{ size.name }}</span>
    </ButtonCommon>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { MenuSelect } from '@/model/Menu';
import ButtonCommon from './common/ButtonCommon.vue';

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
  components: { ButtonCommon },
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
  margin-top: 44px;
}

.menu-size-item {
  width: 80px;
  height: 80px;
  border: 1px solid #000000;
}
.menu-size-item-name {
  font-size: 45px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 45px;
  line-height: 64px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
}
</style>
