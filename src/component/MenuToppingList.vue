<template>
  <div class="menu-topping" v-if="toppings.length">
    <div
      ref="scrollContainer"
      class="menu-topping-scroll"
      :class="{ 'no-scrollbar': toppings.length < 2 }"
    >
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

          <div class="menu-topping-price">
            {{ formatPrice(topping.price) }}￥
          </div>

          <div
            class="menu-topping-checkbox"
            :class="{ checked: isChecked(topping) }"
          ></div>
        </div>
      </PressLayer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, watch } from 'vue';
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
    const scrollContainer = ref<HTMLElement | null>(null);

    const resetScroll = () => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = 0;
      }
    };

    const isChecked = (topping: MenuSelect): boolean => {
      return props.selectedToppings.some(
        (t) => t.select_cd === topping.select_cd
      );
    };

    const onToggleTopping = (topping: MenuSelect) => {
      emit('on-toggle', topping);
    };

    onMounted(() => {
      resetScroll();
    });

    watch(
      () => props.toppings,
      () => {
        setTimeout(() => {
          resetScroll();
        }, 0);
      },
      { immediate: true }
    );

    return {
      scrollContainer,
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
  background: var(--text-inverse);
  border: 1px solid #000;
  padding-top: 19px;
  box-sizing: border-box;
}

.menu-topping-scroll {
  height: 289px;
  width: 1320px;
  overflow-y: auto;
  padding-right: 6px;
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: #9e9e9e #d3d3d3;
}

.menu-topping-scroll.no-scrollbar {
  overflow-y: hidden;
  scrollbar-width: none;
}

.menu-topping-scroll.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.menu-topping-item {
  width: 1262px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 26px 10px 28px;
  cursor: pointer;
}

.menu-topping-item-checked {
  background-color: var(--background-select-toppoing);
  border-radius: 6px;
}

.menu-topping-image {
  width: 80px;
  height: 80px;
  margin: 10px 0 10px 8px;
}
.menu-topping-image img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  object-fit: cover;
}

.menu-topping-name {
  width: 855px;
  height: 98px;
  line-height: 98px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  font-size: 45px;
  margin-left: 14px;
  min-width: 0;
  flex-shrink: 1;
}

.menu-topping-price {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 172px;
  height: 100px;
  font-weight: 400;
  font-size: 45px;
  line-height: 64px;
  text-align: right;
  vertical-align: middle;
  color: var(--text-price);
  margin-right: 42px;
}

.menu-topping-checkbox {
  width: 80px;
  height: 80px;
  border: 8px solid #000;
  border-radius: 6px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.menu-topping-checkbox.checked {
  width: 72.75px;
  height: 75px;
  background: #ff3b30;
  border-color: #ff3b30;
  margin-left: 4px;
}

.menu-topping-checkbox.checked::after {
  content: '';
  width: 32px;
  height: 16px;
  border-left: 6px solid #fff;
  border-bottom: 6px solid #fff;
  transform: rotate(-45deg);
  margin-top: -10px;
}
</style>
