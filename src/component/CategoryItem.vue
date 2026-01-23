<template>
  <div class="category-content-block" @click="onClick">
    <div class="category-content-block-image">
      <ImageViewCommon
        :src="category.image_path || ''"
        fit="cover"
        class="category-content-block-image-detail"
      />
    </div>
    <div class="category-content-block-title">
      {{ category.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ImageViewCommon from '@/component/common/ImageViewCommon.vue';
import { Category } from '@/model/Menu';

export default defineComponent({
  name: 'CategoryBlock',
  components: { ImageViewCommon },
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true,
    },
  },
  emits: ['select'],
  setup(props, { emit }) {
    const onClick = () => {
      emit('select', props.category);
    };

    return { onClick };
  },
});
</script>

<style scoped>
.category-content-block {
  display: flex;
  flex-direction: column;
  align-items: center;
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
