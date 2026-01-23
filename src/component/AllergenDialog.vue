<template>
  <PopupCommon closeOnMask>
    <div class="allergen">
      <div class="allergen-header">
        <div class="allergen-header-icon">
          <ImageViewCommon :src="allergenIcon" alt="allergen icon" />
        </div>
        <DictTextCommon keyName="ALLERGEN_LABEL" class="text-link" />
      </div>
      <div class="allergen-content">
        <ImageViewCommon :src="image" alt="allergen" />
      </div>

      <div class="allergen-actions">
        <ButtonCommon type="neutral" @confirm="onCloseAllergen">
          <DictTextCommon keyName="CLOSE_BUTTON" />
        </ButtonCommon>
      </div>
    </div>
  </PopupCommon>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import PopupCommon from '@/component/common/PopupCommon.vue';
import ButtonCommon from '@/component/common/ButtonCommon.vue';
import DictTextCommon from '@/component/common/DictTextCommon.vue';
import { Language } from '@/model/Enums';
import allergenListJapan from '@/assets/Image/guide/allergen-list-japan.jpg';
import allergenListChina from '@/assets/Image/guide/allergen-list-china.jpg';
import allergenListEnglish from '@/assets/Image/guide/allergen-list-english.jpg';
import ImageViewCommon from '@/component/common/ImageViewCommon.vue';
import allergenIcon from '@/assets/Image/icon/allergen-icon.png';

export default defineComponent({
  name: 'AllergenDialog',
  components: {
    PopupCommon,
    ButtonCommon,
    DictTextCommon,
    ImageViewCommon,
  },
  props: {
    currentLang: {
      type: String as PropType<Language>,
      required: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
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

    const onCloseAllergen = () => {
      emit('close');
    };

    return { image, allergenIcon, onCloseAllergen };
  },
});
</script>

<style scoped>
.allergen {
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
}

.allergen-header-icon {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.allergen-content {
  flex: 1;
  border-radius: 6px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  height: calc(100% - 350px);
}

.allergen-content :deep(img) {
  width: 1400px;
  height: 680px;
  object-fit: contain;
}

.allergen-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
