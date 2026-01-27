<template>
  <div class="cart-item">
    <img class="cart-item-image" :src="item.imagePath" />

    <div class="cart-item-info">
      <div class="cart-item-name">{{ item.name }}</div>

      <div v-if="item.size" class="cart-item-size">
        {{ item.size.name }}
      </div>
    </div>

    <div class="cart-item-qty">× {{ item.quantity }}</div>

    <div class="cart-item-price">{{ formatPrice(item.total) }}￥</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { formatPrice } from '@/util/FormatPrice';
import { CartItem } from '@/model/Menu';

export default defineComponent({
  name: 'CartItem',
  props: {
    item: {
      type: Object as PropType<CartItem>,
      required: true,
    },
  },
  setup() {
    return { formatPrice };
  },
});
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  background: #e3f2ec;
  padding: 12px;
  border-radius: 8px;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;
  margin-left: 12px;
}

.cart-item-name {
  font-size: 22px;
  font-weight: 600;
}

.cart-item-size {
  margin-top: 4px;
  font-size: 18px;
  color: #444;
}

.cart-item-qty {
  width: 80px;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
}

.cart-item-price {
  min-width: 140px;
  text-align: right;
  font-size: 22px;
  font-weight: 800;
  color: #d32f2f;
}
</style>
