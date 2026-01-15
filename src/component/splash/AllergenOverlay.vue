<template>
  <BaseOverlay closeOnMask @close="$emit('close')">
    <div class="allergen-card">
      <div class="allergen-header">
        <ImageView :src="allergenIcon" alt="allergen icon" class="allergen-icon" />
        <DictText keyName="ALLERGEN_LABEL" class="text-accent" />
      </div>
      <div class="allergen-content">
        <ImageView :src="image" alt="allergen" class="allergen-image" />
      </div>

      <div class="allergen-actions">
        <BaseButton type="neutral" @confirm="$emit('close')">
          <DictText keyName="CLOSE_BUTTON" />
        </BaseButton>
      </div>
    </div>
  </BaseOverlay>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import BaseOverlay from '@/component/common/BaseOverlay.vue';
import BaseButton from '@/component/common/BaseButton.vue';
import DictText from '@/component/common/DictText.vue';
import { Language } from '@/model/enums';
import allergenListJapan from '@/assets/Image/guide/allergen-list-japan.jpg';
import allergenListChina from '@/assets/Image/guide/allergen-list-china.jpg';
import allergenListEnglish from '@/assets/Image/guide/allergen-list-english.jpg';
import ImageView from '../common/ImageView.vue';
import allergenIcon from '@/assets/Image/icon/allergen-icon.png';

export default defineComponent({
  name: 'AllergenOverlay',
  components: {
    BaseOverlay,
    BaseButton,
    DictText,
    ImageView,
  },
  props: {
    currentLang: {
      type: String as PropType<Language>,
      required: true,
    },
  },
  emits: ['close'],
  setup(props) {
    const image = computed(() => {
      switch (props.currentLang) {
        case Language.JA:
          return allergenListJapan;
        case Language.ZH:
          return allergenListChina;
        case Language.EN:
        default:
          return allergenListEnglish;
      }
    });

    return { image, allergenIcon };
  },
});
</script>

<style scoped>
.allergen-card {
  background: var(--background-dialog);
  border-radius: 10px;
  padding: 24px 32px 20px;
  box-sizing: border-box;
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
}

.allergen-header {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-accent);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.allergen-icon {
  width: 75px;
  height: 75px;
}

.allergen-content {
  flex: 1;
  border-radius: 6px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.allergen-content :deep(img) {
  width: 1450px;
  height: 630px;
  object-fit: contain;
}

.allergen-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
