<template>
  <PressLayer @touchend="onTouchend">
    <div class="cart-item">
      <div class="cart-item-left">
        <div class="cart-item-image">
          <ImageView :src="item.imagePath" />
        </div>

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
import ImageView from './common/ImageView.vue';

export default defineComponent({
  name: 'CartItem',
  components: { PressLayer, ImageView },
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
  justify-content: space-between;
  background-color: var(--background-items);
  border-radius: 8px;
}

.cart-item-left {
  display: flex;
  flex: 1;
  min-width: 0;
}

.cart-item-image {
  width: 180px;
  height: 180px;
  overflow: hidden;
  margin: 10px 0 10px 9px;
  border-radius: 10px;
}

.cart-item-image :deep(img) {
  width: 365px;
  height: 357px;
  object-fit: none;
  transform: scale(1.4);
}

.cart-item-info-detail {
  display: flex;
  flex-direction: column;
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
  margin-left: 23px;
  margin-top: 10px;
}

.cart-item-size {
  width: fit-content;
  height: 50px;
  width: 50px;
  font-weight: 600;
  color: var(--text-inverse);
  background-color: var(--btn-link);
  border-radius: 6px;
  margin: 11px 0 9px 10px;
  font-size: 45px;
  line-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item-right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.cart-item-quantity {
  width: 319px;
  height: 60px;
  font-weight: 700;
  font-size: 50px;
  color: var(--text-link);
  text-align: right;
  margin-bottom: 64px;
  padding-right: 4px;
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
  font-weight: 700px;
  font-size: 30px;
  line-height: 30px;
  
  margin: 0 14px 18px 0;
}
</style>
