<template>
  <div class="menu-topping" v-if="toppings.length">
    <PressLayer
      v-for="topping in toppings"
      :key="topping.select_cd"
      @touchend="onToggleTopping(topping)"
    >
      <div
        class="menu-topping-item"
        :class="{ 'menu-topping-item-checked': isChecked(topping) }"
      >
        <div class="menu-topping-image">
          <ImageView :src="topping.image_path || ''" fit="cover" />
        </div>

        <div class="menu-topping-name">
          {{ topping.name }}
        </div>

        <div class="menu-topping-price">{{ formatPrice(topping.price) }}￥</div>

        <input type="checkbox" :checked="isChecked(topping)" readonly />
      </div>
    </PressLayer>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { MenuSelect } from '@/model/Menu';
import ImageView from '@/component/common/ImageView.vue';
import PressLayer from '@/component/common/PressLayer.vue';
import { formatPrice } from '@/util/FormatPrice';

export default defineComponent({
  name: 'MenuToppingList',
  components: {
    ImageView,
    PressLayer,
  },
  props: {
    toppings: {
      type: Array as PropType<MenuSelect[]>,
      required: true,
    },
    selectedToppings: {
      type: Array as PropType<MenuSelect[]>,
      required: true,
    },
  },
  emits: ['on-toggle'],
  setup(props, { emit }) {
    const isChecked = (topping: MenuSelect): boolean => {
      return props.selectedToppings.some(
        (t) => t.select_cd === topping.select_cd
      );
    };

    const onToggleTopping = (topping: MenuSelect) => {
      emit('on-toggle', topping);
    };

    return {
      isChecked,
      onToggleTopping,
      formatPrice,
    };
  },
});
</script>

<style scoped>
.menu-topping {
  margin-top: 12px;
  border: 2px solid #aaa;
  background: #fff;
  max-height: 315px;
  overflow-y: auto;
}

.menu-topping-item {
  display: grid;
  grid-template-columns: 80px 1fr 120px 60px;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
}

.menu-topping-item-checked {
  border: 2px solid #e53935;
}

.menu-topping-image {
  width: 80px;
  height: 80px;
}

.menu-topping-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-topping-price {
  color: red;
  font-weight: 700;
  text-align: right;
}
</style>
