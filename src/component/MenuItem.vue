<template>
  <div
    class="menu-item"
    :class="{ 'menu-item-soldout': item.soldOut }"
    @mousedown.prevent="onClick"
  >
    <div v-if="item.soldOut" class="menu-item-soldout-overlay">SOLD OUT</div>

    <div class="menu-item-image">
      <ImageView :src="item.imagePath || ''" fit="contain" />
    </div>

    <div class="menu-item-info">
      <div class="menu-item-info-name">{{ item.name }}</div>
      <div class="menu-item-info-desc">{{ item.description }}</div>

      <div class="menu-item-info-price">
        <div class="menu-item-info-price-detail">
          {{ formatPrice(item.price) }}￥
          <span v-if="item.hasSelectSize">～</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ImageView from '@/component/common/ImageView.vue';
import { MenuItem } from '@/model/Menu';
import { formatPrice } from '@/util/FormatPrice';

export default defineComponent({
  name: 'MenuItem',
  components: { ImageView },
  emits: ['on-select'],
  props: {
    item: {
      type: Object as PropType<MenuItem>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const onClick = () => {
      if (props.item.soldOut) return;
      emit('on-select', props.item.menu_cd);
    };
    return { onClick, formatPrice };
  },
});
</script>

<style scoped>
.menu-item {
  position: relative;
  display: flex;
  height: 300px;
  width: 740px;
  background: var(--background-items);
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
}

.menu-item-soldout {
  cursor: not-allowed;
}

.menu-item-soldout-overlay {
  position: absolute;
  inset: 0;
  z-index: var(--z-stockout);
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-inverse);
  pointer-events: none;
}

.menu-item-soldout {
  cursor: not-allowed;
}

.menu-item-image {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 10px 0 0 10px;
  overflow: hidden;
  flex-shrink: 0;
  object-fit: none;
}

.menu-item-image img {
  width: 300px;
  height: 300px;
  margin: auto;
  object-fit: none;
  border-radius: 10px;
}

.menu-item-info {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
}

.menu-item-info-name {
  font-size: 40px;
  font-weight: 600;
  color: var(--text-primary);
  width: 420px;
  height: 111px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-item-info-desc {
  font-size: 25px;
  font-weight: 400;
  color: var(--text-primary);
  width: 420px;
  height: 89px;
  line-height: 30px;
  font-style: Regular;
  letter-spacing: 0%;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-item-info-price {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
}

.menu-item-info-price-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 319px;
  height: 58px;
  background: var(--text-accent);
  color: var(--text-inverse);
  border-radius: 50px;
  font-weight: 700;
  font-size: 50px;
  margin-bottom: 13px;
  font-style: Bold;
  line-height: 30px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
}
</style>
