<template>
  <div class="cart-wrapper">
    <div class="cart-header">
      <DictText keyName="LIST_ORDER_LABEL" />（{{ totalQuantity
      }}<DictText keyName="NUMBER_ORDER_LABEL" />）
    </div>

    <div class="cart-list">
      <OrderItem
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        @on-click="openEditDialog(item, index)"
      />
    </div>

    <Transition name="fade">
      <MenuDetailDialog
        v-if="editingItem"
        :menuCd="editingItem.menuCd"
        :editMode="true"
        :cartItem="editingItem"
        :cartIndex="editingIndex"
        @on-close="closeEditDialog"
        @on-confirm="handleEditConfirm"
      />
    </Transition>

    <div class="cart-total">
      <div class="cart-total-wrapper">
        <div class="cart-total-wrapper-label">
          <DictText keyName="TOTAL_LABEL" /> ：
        </div>
        <span class="cart-total-wrapper-price"
          >{{ formatPrice(totalPrice) }}￥</span
        >
      </div>
    </div>

    <div class="cart-footer">
      <ButtonCommon
        class="btn-back"
        @touchend="onBackCategory"
        text-color="inverse"
        type="neutral"
        ><DictText keyName="BACK_BUTTON"
      /></ButtonCommon>

      <ButtonCommon
        class="btn-order"
        @touchend="onComfirmOrder"
        text-color="inverse"
        type="red"
        ><DictText keyName="ORDER_BUTTON"
      /></ButtonCommon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import OrderItem from '@/component/OrderItem.vue';
import MenuDetailDialog from '@/component/MenuDetailDialog.vue';
import DictText from '@/component/common/DictText.vue';
import ButtonCommon from '@/component/common/ButtonCommon.vue';
import { formatPrice } from '@/util/FormatPrice';
import { OrderListPageLogic } from '@/logic/page/OrderListPageLogic';

export default defineComponent({
  name: 'OrderListPage',
  components: { OrderItem, DictText, MenuDetailDialog, ButtonCommon },

  setup() {
    const logic = new OrderListPageLogic();

    return {
      items: logic.items,
      editingItem: logic.editingItem,
      editingIndex: logic.editingIndex,
      totalQuantity: computed(() => logic.totalQuantity),
      totalPrice: computed(() => logic.totalPrice),
      formatPrice,
      openEditDialog: logic.openEdit.bind(logic),
      closeEditDialog: logic.closeEdit.bind(logic),
      handleEditConfirm: logic.handleEditConfirm.bind(logic),
      onBackCategory: logic.backToCategory.bind(logic),
      onComfirmOrder: logic.confirmOrder.bind(logic),
    };
  },
});
</script>

<style scoped>
.cart-wrapper {
  background: #fffdf5;
  display: flex;
  flex-direction: column;
}

.cart-header {
  height: 107px;
  width: 1680px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 70px;
  line-height: 18px;

  text-align: center;
}

.cart-list {
  height: 634px;
  width: 1660px;
  overflow-y: auto;
  padding: 0 50px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  scrollbar-width: thin;
  scrollbar-color: #9e9e9e #d3d3d3;
}

.cart-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 56px 31px 50px;
}

.btn-back {
  width: 220px;
  height: 70px;
  font-size: 22px;
  font-weight: 700;
}

.cart-total {
  display: flex;
  justify-content: end;
  align-items: center;
}

.cart-total-wrapper {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 57px 53px 19px 0;
  width: 574px;
  height: 100px;
}

.cart-total-wrapper-label {
  font-weight: 700;
  font-size: 70px;
  line-height: 30px;

  text-align: right;
  vertical-align: middle;
  color: var(--text-link);
}

.cart-total-wrapper-price {
  font-weight: 700;
  font-size: 70px;
  line-height: 30px;

  text-align: right;
  vertical-align: middle;
  color: var(--text-price);
}
.btn-order {
  width: 220px;
  height: 70px;
  font-size: 24px;
  font-weight: 800;
}
</style>
