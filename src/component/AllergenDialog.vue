<template>
  <PopupCommon closeOnMask>
    <div ref="dialogEl" class="allergen anim-fade-scale">
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
          @touchend="onMousedownCloseAllergen"
        >
          <DictText keyName="CLOSE_BUTTON" />
        </ButtonCommon>
      </div>
    </div>
  </PopupCommon>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';
import PopupCommon from '@/component/common/PopupCommon.vue';
import ButtonCommon from '@/component/common/ButtonCommon.vue';
import DictText from '@/component/common/DictText.vue';
import { Language } from '@/model/Enums';
import allergenListJapan from '@/assets/Image/guide/allergen-list-japan.jpg';
import allergenListChina from '@/assets/Image/guide/allergen-list-china.jpg';
import allergenListEnglish from '@/assets/Image/guide/allergen-list-english.jpg';
import ImageView from '@/component/common/ImageView.vue';
import allergenIcon from '@/assets/Image/icon/allergen-icon.png';
import { playEnter, playLeave } from '@/util/AnimationUtil';

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
  emits: ['on-close'],
  setup(props, { emit }) {
    const dialogEl = ref<HTMLElement | null>(null);

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

    onMounted(() => {
      playEnter(dialogEl);
    });

    const onMousedownCloseAllergen = () => {
      playLeave(dialogEl, 'anim-leave', 250, () => {
        emit('on-close');
      });
    };

    return {
      dialogEl,
      image,
      allergenIcon,
      onMousedownCloseAllergen,
    };
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
  height: 75px;
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
