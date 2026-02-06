<template>
  <div ref="pageEl" class="cart-wrapper anim-fade-scale">
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

    <keep-alive>
      <MenuDetailDialog
        v-show="editingItem"
        :menuCd="editingItem?.menuCd || ''"
        :editMode="true"
        :cartItem="editingItem || undefined"
        :cartIndex="editingIndex"
        @on-close="closeEditDialog"
        @on-confirm="handleEditConfirm"
      />
    </keep-alive>

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
      <PressLayer @touchend="onBackPreviousPage">
        <ButtonCommon class="btn-back" text-color="inverse" type="neutral"
          ><DictText keyName="BACK_BUTTON"
        /></ButtonCommon>
      </PressLayer>

      <PressLayer>
        <ButtonCommon
          class="btn-order"
          @touchend="onConfirmOrder"
          text-color="inverse"
          type="red"
          ><DictText keyName="ORDER_BUTTON"
        /></ButtonCommon>
      </PressLayer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onActivated, onMounted, ref } from 'vue';
import OrderItem from '@/component/OrderItem.vue';
import MenuDetailDialog from '@/component/MenuDetailDialog.vue';
import DictText from '@/component/common/DictText.vue';
import ButtonCommon from '@/component/common/ButtonCommon.vue';
import { formatPrice } from '@/util/FormatPrice';
import { OrderListPageLogic } from '@/logic/page/OrderListPageLogic';
import { playEnter } from '@/util/AnimationUtil';
import PressLayer from '@/component/common/PressLayer.vue';

export default defineComponent({
  name: 'OrderListPage',
  components: { OrderItem, DictText, MenuDetailDialog, ButtonCommon, PressLayer },

  setup() {
    const pageEl = ref<HTMLElement | null>(null);
    const logic = new OrderListPageLogic();

    const triggerEnterAnimation = () => playEnter(pageEl);
    onMounted(triggerEnterAnimation);
    onActivated(triggerEnterAnimation);

    return {
      pageEl,
      items: logic.items,
      editingItem: logic.editingItem,
      editingIndex: logic.editingIndex,
      totalQuantity: computed(() => logic.totalQuantity),
      totalPrice: computed(() => logic.totalPrice),
      formatPrice,
      openEditDialog: logic.openEdit.bind(logic),
      closeEditDialog: logic.closeEdit.bind(logic),
      handleEditConfirm: logic.handleEditConfirm.bind(logic),
      onBackPreviousPage: logic.backToPreviousPage.bind(logic),
      onConfirmOrder: logic.confirmOrder.bind(logic),
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
  color: var(--text-link);
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
  width: 700px;
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

.btn-back :deep(*),
.btn-order :deep(*) {
  font-weight: 600;
  font-size: 45px;
  line-height: 64px;
  text-align: center;
  vertical-align: middle;
}
</style>
