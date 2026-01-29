<template>
  <PressLayer @touchend="onTouchend">
    <div class="cart-item">
      <div class="cart-item-left">
        <img class="cart-item-image" :src="item.imagePath" />

        <div class="cart-item-info-detail">
          <div class="cart-item-name">
            {{ item.name }}
          </div>

          <div v-if="item.size" class="cart-item-size">
            {{ item.size.name }}
          </div>
        </div>
      </div>

      <div class="cart-item-right">
        <div class="cart-item-quantity">× {{ item.quantity }}</div>

        <div class="cart-item-price">{{ formatPrice(item.total) }}￥</div>
      </div>
    </div>
  </PressLayer>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { formatPrice } from '@/util/FormatPrice';
import { CartItem } from '@/model/Menu';
import PressLayer from './common/PressLayer.vue';

export default defineComponent({
  name: 'CartItem',
  components: { PressLayer },
  props: {
    item: {
      type: Object as PropType<CartItem>,
      required: true,
    },
  },
  emits: ['on-click'],
  setup(props, { emit }) {
    const onTouchend = () => {
      emit('on-click', props.item);
    };

    return {
      formatPrice,
      onTouchend,
    };
  },
});
</script>

<style scoped>
.cart-item {
  width: 1574px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--background-items);
  border-radius: 8px;
}

.cart-item-left {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.cart-item-image {
  width: 180px;
  height: 180px;
  border-radius: 10px;
  object-fit: cover;
  margin-left: 9px;
}

.cart-item-info-detail {
  display: flex;
  flex-direction: column;
  margin-left: 23px;
  min-width: 0;
}

.cart-item-name {
  width: 778px;
  height: 120px;
  font-weight: 600;
  font-size: 40px;
  line-height: 64px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-size {
  width: fit-content;
  padding: 4px 16px;
  font-size: 30px;
  font-weight: 600;
  color: var(--text-inverse);
  background-color: var(--btn-link);
  border-radius: 6px;
  margin-top: 6px;
}

.cart-item-right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 14px;
}

.cart-item-quantity {
  width: 319px;
  height: 60px;
  font-weight: 700;
  font-size: 50px;
  color: var(--text-link);
  text-align: right;
  margin-bottom: 64px;
}

.cart-item-price {
  width: 181px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 12px;
  background-color: var(--text-accent);
  color: var(--text-inverse);
  border-radius: 1000px;
  font-weight: 700;
  font-size: 30px;
  line-height: 30px;
  letter-spacing: 0%;
  text-align: right;
  vertical-align: middle;
  margin: 0 14px 18px 0;
}
</style>
