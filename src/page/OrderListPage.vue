<template>
  <div class="cart-wrapper">
    <div class="cart-header">
      <DictText keyName="LIST_ORDER_LABEL" />（{{ totalQuantity }}個）
    </div>

    <div class="cart-list">
      <OrderItem v-for="(item, index) in items" :key="index" :item="item" />
    </div>

    <div class="cart-footer">
      <button class="btn-back" @touchend="$emit('on-close')"><DictText keyName="BACK_BUTTON" /></button>
      
      <div class="cart-total"><DictText keyName="TOTAL_LABEL" />：{{ formatPrice(totalPrice) }}￥</div>

      <button class="btn-order" @touchend="$emit('on-order')"><DictText keyName="ORDER_BUTTON" /></button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OrderItem from '@/component/OrderItem.vue';
import DictText from '@/component/common/DictText.vue';
import { formatPrice } from '@/util/FormatPrice';
import { CartLogic } from '@/logic/page/OrderListPageLogic';

export default defineComponent({
  name: 'OrderListPage',
  components: { OrderItem, DictText },
  emits: ['on-close', 'on-order'],
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
