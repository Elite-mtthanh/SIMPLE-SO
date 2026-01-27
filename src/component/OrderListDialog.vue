<template>
  <PopupCommon @close="$emit('close')">
    <div class="cart-wrapper">
      <div class="cart-header">注文リスト（{{ totalQuantity }}個）</div>

      <div class="cart-list">
        <CartItem
          v-for="(item, index) in items"
          :key="index"
          :item="item"
        />
      </div>

      <div class="cart-footer">

        <button class="btn-back" @click="$emit('close')">戻る</button>

        <div class="cart-total">合計：{{ formatPrice(totalPrice) }}￥</div>

        <button class="btn-order" @click="$emit('order')">注文する</button>
      </div>
    </div>
  </PopupCommon>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CartItem from './OrderItem.vue';
import PopupCommon from './common/PopupCommon.vue';
import { formatPrice } from '@/util/FormatPrice';
import { CartLogic } from '@/logic/page/OrderListLogic';

export default defineComponent({
  name: 'CartList',
  components: { CartItem, PopupCommon },
  emits: ['close', 'order'],
  setup() {
    const logic = new CartLogic();

    return {
      items: logic.items,
      totalQuantity: logic.totalQuantity,
      totalPrice: logic.totalPrice,
      formatPrice,
    };
  },
});
</script>

<style scoped>
.cart-wrapper {
  width: 100%;
  height: 100%;
  background: #fffdf5;
  display: flex;
  flex-direction: column;
}

.cart-header {
  font-size: 32px;
  font-weight: 700;
  padding: 16px;
  text-align: center;
}

.cart-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
}

.btn-back {
  width: 220px;
  height: 70px;
  background: #9e9e9e;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}

.cart-total {
  font-size: 32px;
  font-weight: 800;
  color: #d32f2f;
}

.btn-order {
  width: 220px;
  height: 70px;
  background: #d32f2f;
  color: #fff;
  font-size: 24px;
  font-weight: 800;
}
</style>
