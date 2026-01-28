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
          @touchend="quantity > 1 && onDecrease()"
          :class="{ disabled: quantity <= 1 }"
        >
          <ImageView src="/Image/menu/minus.png" />
        </PressLayer>

        <span>{{ quantity }}</span>

        <PressLayer
          class="menu-detail-quantity-btn"
          @touchend="quantity < 10 && onIncrease()"
          :class="{ disabled: quantity >= 10 }"
        >
          <ImageView src="/Image/menu/plus.png" />
        </PressLayer>
      </div>

      <div class="menu-detail-total">{{ formatPrice(totalPrice) }}￥</div>
    </div>

    <ButtonCommon
      class="menu-detail-btn-confirm"
      @touchend="onConfirm"
      text-color="inverse"
      type="accent"
    >
      <DictText keyName="CONFIRM_BUTTON" />
    </ButtonCommon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  emits: ['on-cancel', 'on-confirm', 'on-increase', 'on-decrease'],
  setup(_, { emit }) {
    return {
      formatPrice,
      onCancel: () => emit('on-cancel'),
      onConfirm: () => emit('on-confirm'),
      onIncrease: () => emit('on-increase'),
      onDecrease: () => emit('on-decrease'),
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
}

.menu-detail-quantity {
  display: flex;
  align-items: center;
  gap: 17px;
}

.menu-detail-quantity-btn {
  width: 90px;
  height: 90px;
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
  letter-spacing: 0%;
  vertical-align: middle;
  color: var(--text-price);
}

.menu-detail-btn-cancel,
.menu-detail-btn-confirm {
  font-weight: 600;
  font-size: 45px;
  leading-trim: NONE;
  line-height: 64px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  border-radius: 6px;
  margin-right: 52px;
}
</style>
