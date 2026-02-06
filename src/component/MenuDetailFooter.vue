<template>
  <div class="menu-detail-footer">
    <ButtonCommon
      class="menu-detail-btn-cancel"
      @touchend="onCancel"
      text-color="inverse"
      type="neutral"
    >
      <DictText keyName="CANCEL_BUTTON" />
    </ButtonCommon>

    <div class="menu-detail-footer-price">
      <div class="menu-detail-quantity">
        <PressLayer
          class="menu-detail-quantity-btn"
          @touchend="(editMode ? quantity > 0 : quantity > 1) && onDecrease()"
          :class="{ disabled: editMode ? quantity <= 0 : quantity <= 1 }"
        >
          <ImageView src="/Image/menu/minus.png" />
        </PressLayer>

        <span>{{ quantity }}</span>

        <PressLayer
          class="menu-detail-quantity-btn"
          @touchend="quantity < maxQuantity && onIncrease()"
          :class="{ disabled: quantity >= maxQuantity }"
        >
          <ImageView src="/Image/menu/plus.png" />
        </PressLayer>
      </div>

      <div class="menu-detail-total">{{ formatPrice(totalPrice) }}￥</div>
    </div>

    <PressLayer @touchend="onConfirm">
      <ButtonCommon
        class="menu-detail-btn-confirm"
        text-color="inverse"
        type="accent"
        :class="{ disabled: quantity >= maxQuantity + 1 || isProcessing }"
      >
        <DictText keyName="CONFIRM_BUTTON" />
      </ButtonCommon>
    </PressLayer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ButtonCommon from '@/component/common/ButtonCommon.vue';
import DictText from '@/component/common/DictText.vue';
import PressLayer from '@/component/common/PressLayer.vue';
import ImageView from '@/component/common/ImageView.vue';
import { formatPrice } from '@/util/FormatPrice';

export default defineComponent({
  name: 'MenuDetailFooter',
  components: {
    ButtonCommon,
    DictText,
    PressLayer,
    ImageView,
  },
  props: {
    quantity: {
      type: Number,
      required: true,
    },
    maxQuantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['on-cancel', 'on-confirm', 'on-increase', 'on-decrease', 'on-delete'],
  setup(_, { emit }) {
    const isProcessing = ref(false);

    const onConfirm = () => {
      if (isProcessing.value) return;
      isProcessing.value = true;
      emit('on-confirm');
      setTimeout(() => {
        isProcessing.value = false;
      }, 500);
    };

    return {
      formatPrice,
      isProcessing,
      onCancel: () => emit('on-cancel'),
      onConfirm,
      onIncrease: () => emit('on-increase'),
      onDecrease: () => emit('on-decrease'),
      onDelete: () => emit('on-delete'),
    };
  },
});
</script>

<style scoped>
.menu-detail-footer {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  align-items: center;
  padding: 0 32px 28px;
}

.menu-detail-footer-price {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 36px;
  margin-left: 52px;
}

.menu-detail-quantity {
  display: flex;
  align-items: center;
  gap: 17px;
}

.menu-detail-quantity-btn {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--btn-link);
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-detail-quantity-btn.disabled {
  opacity: 0.35;
  pointer-events: none;
}

.menu-detail-quantity span {
  min-width: 146px;
  height: 100px;
  border: 1px solid #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 80px;
  line-height: 64px;
  color: var(--text-link);
}

.menu-detail-total {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 388px;
  height: 100px;
  font-weight: 600;
  font-size: 80px;
  line-height: 64px;
  vertical-align: middle;
  color: var(--text-price);
}

.menu-detail-btn-cancel :deep(*),
.menu-detail-btn-confirm :deep(*) {
  font-weight: 600;
  font-size: 45px;
  line-height: 64px;
  border-radius: 6px;
  height: 100px;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
