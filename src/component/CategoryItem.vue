<template>
  <PressLayer @touchend="onSelect">
    <div class="category-content-block" :class="{ 'category-soldout': category.soldOut }">
      <div v-if="category.soldOut" class="category-soldout-overlay">
        <DictText keyName="SOLD_OUT" />
      </div>

      <div class="category-content-block-image">
        <ImageView
          :src="category.image_path || ''"
          fit="cover"
          class="category-content-block-image-detail"
        />
      </div>
      <div class="category-content-block-title">
        {{ category.name }}
      </div>
    </div>
  </PressLayer>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ImageView from '@/component/common/ImageView.vue';
import PressLayer from '@/component/common/PressLayer.vue';
import DictText from '@/component/common/DictText.vue';
import { Category } from '@/model/Menu';

export default defineComponent({
  name: 'CategoryBlock',
  components: {
    ImageView,
    PressLayer,
    DictText,
  },
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true,
    },
  },
  emits: ['select'],
  setup(props, { emit }) {
    const onSelect = () => {
      if (props.category.soldOut) return;
      emit('select', props.category);
    };

    return { onSelect };
  },
});
</script>

<style scoped>
.category-content-block {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-soldout {
  cursor: not-allowed;
}

.category-soldout-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  letter-spacing: 1px;
  color: var(--text-inverse);
  pointer-events: none;
  font-weight: 600;
  border-radius: 6px;
}

.category-content-block-image {
  width: 300px;
  height: 300px;
}

.category-content-block-image-detail {
  border-radius: 6px;
}

.category-content-block-title {
  width: 300px;
  height: 70px;
  font-size: 40px;
  font-weight: 600;
  text-align: center;
  color: var(--text-link);
  margin-top: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
