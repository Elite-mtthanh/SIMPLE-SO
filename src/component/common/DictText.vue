<template>
    <span>{{ text }}</span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { AppConfig } from '@/model/AppConfig';
import { ServiceIF } from '@/services/ServiceIF';

export default defineComponent({
    name: 'DictText',
    props: {
        keyName: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const dict = ServiceIF.getDict(props.keyName);

        const text = computed(() => {
            if (!dict) return '';

            const idx = AppConfig.Instance.langIndex.value;
            const texts = [dict.text1, dict.text2, dict.text3];

            return texts[idx] ?? '';
        });

        return {
            text,
        };
    }
});
</script>
