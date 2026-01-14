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
import { defineComponent } from 'vue';
import BaseOverlay from '@/component/common/BaseOverlay.vue';
import BaseButton from '@/component/common/BaseButton.vue';
import DictText from '@/component/common/DictText.vue';

import allergenImage from '@/assets/Image/guide/allergen-list.png';

export default defineComponent({
    name: 'AllergenOverlay',
    components: {
        BaseOverlay,
        BaseButton,
        DictText,
    },
    emits: ['close'],
    setup() {
        return {
            image: allergenImage,
        };
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
