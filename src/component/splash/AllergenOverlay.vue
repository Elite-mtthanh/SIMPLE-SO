<template>
    <BaseOverlay closeOnMask @close="$emit('close')">
        <div class="allergen-card">
            <div class="item-splash">
                <img :src="image" alt="allergen" />
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
import { Language } from '@/model/Splash';
import allergenListJapan from '@/assets/Image/guide/allergen-list-japan.jpg';
import allergenListChina from '@/assets/Image/guide/allergen-list-china.jpg';
import allergenListEnglish from '@/assets/Image/guide/allergen-list-english.jpg';

export default defineComponent({
    name: 'AllergenOverlay',
    components: {
        BaseOverlay,
        BaseButton,
        DictText,
    },
    props: {
        currentLang: {
            type: Number as PropType<Language>,
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

        return { image };
    },
});

</script>

<style scoped>
.allergen-card {
    background: var(--background-dialog);
    border-radius: 10px;
    padding: 24px;
    box-sizing: border-box;
}

.item-splash img {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
}

.allergen-actions {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
</style>
