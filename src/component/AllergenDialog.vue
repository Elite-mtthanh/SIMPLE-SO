<template>
  <PopupCommon closeOnMask>
    <div class="allergen">
      <div class="allergen-header">
        <div class="allergen-header-icon">
          <ImageView :src="allergenIcon" alt="allergen icon" />
        </div>
        <DictText keyName="ALLERGEN_LABEL" class="text-link" />
      </div>
      <div class="allergen-content">
        <ImageView :src="image" alt="allergen" />
      </div>

      <div class="allergen-actions">
        <ButtonCommon
          type="neutral"
          text-color="inverse"
          @mousedown="onMousedownCloseAllergen"
        >
          <DictText keyName="CLOSE_BUTTON" />
        </ButtonCommon>
      </div>
    </div>
  </PopupCommon>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import PopupCommon from '@/component/common/PopupCommon.vue';
import ButtonCommon from '@/component/common/ButtonCommon.vue';
import DictText from '@/component/common/DictText.vue';
import { Language } from '@/model/Enums';
import allergenListJapan from '@/assets/Image/guide/allergen-list-japan.jpg';
import allergenListChina from '@/assets/Image/guide/allergen-list-china.jpg';
import allergenListEnglish from '@/assets/Image/guide/allergen-list-english.jpg';
import ImageView from '@/component/common/ImageView.vue';
import allergenIcon from '@/assets/Image/icon/allergen-icon.png';

export default defineComponent({
  name: 'AllergenDialog',
  components: {
    PopupCommon,
    ButtonCommon,
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

    const onMousedownCloseAllergen = () => {
      emit('close');
    };

    return { image, allergenIcon, onMousedownCloseAllergen };
  },
});
</script>

<style scoped>
.allergen {
  background: var(--background-dialog);
  border-radius: 10px;
  padding: 24px 32px 20px;
  box-sizing: border-box;
  width: 1520px;
  height: 965px;
  display: flex;
  flex-direction: column;
}

.allergen-header {
  font-size: 48px;
  color: var(--text-error);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 50px;
  line-height: 18px;
}

.allergen-header-icon {
  width: 79px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.allergen-content {
  flex: 1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
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
