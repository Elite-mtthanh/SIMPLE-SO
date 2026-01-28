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

      <input type="checkbox" class="menu-topping-checkbox" :checked="isChecked(topping)" readonly />
    </div>
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
  width: 1346px;
  height: 315px;
  margin-right: 20px;
  border: 2px solid #aaa;
  background: #fff;
  overflow-y: auto;
}

.menu-topping-item {
  display: grid;
  grid-template-columns: 80px 1fr 120px 60px;
  align-items: center;
  padding: 19px 56px 10px 28px;
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
  width: 855px;
  height: 98px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  font-size: 45px;
  leading-trim: NONE;
  line-height: 64px;
  letter-spacing: 0%;
  vertical-align: middle;
  margin-left: 14px;
}

.menu-topping-price {
  font-weight: 400;
  font-size: 45px;
  leading-trim: NONE;
  line-height: 64px;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  color: var(--text-price);
}

.menu-topping-checkbox {
  width: 80px;
  height: 80px;
  border: 8px;
  margin-right: 42px;
  border-color: var(--text-primary);
  border-radius: 8px;
}
</style>
