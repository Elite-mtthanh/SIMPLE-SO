<template>
    <div class="dropdown-wrapper">
        <BaseButton :type="type" :textColor="textColor" :icon="icon" iconPosition="right" @confirm="toggle">
            <slot name="label" />
        </BaseButton>

        <div v-if="open" class="dropdown-panel">
            <div v-for="item in items" :key="item.value" class="dropdown-item"
                :class="{ active: item.value === modelValue }" @click="select(item.value)">
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseButton from './BaseButton.vue';

export interface DropdownItem {
    label: string;
    value: number | string;
}

export default defineComponent({
    name: 'DropdownButton',
    components: { BaseButton },
    props: {
        modelValue: {
            type: [String, Number],
            required: true,
        },
        items: {
            type: Array as () => DropdownItem[],
            required: true,
        },
        type: {
            type: String,
            default: 'soft',
        },
        textColor: {
            type: String,
            default: 'link',
        },
        icon: {
            type: String,
            default: '',
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const open = ref(false);

        const toggle = () => {
            open.value = !open.value;
        };

        const select = (value: string | number) => {
            emit('update:modelValue', value);
            open.value = false;
        };

        return {
            open,
            toggle,
            select,
        };
    },
});
</script>
<style scoped>
.dropdown-wrapper {
    position: relative;
}

.dropdown-panel {
    position: absolute;
    bottom: 100%;
    left: 0;

    width: 100%;
    margin-bottom: 8px;

    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
}

.dropdown-item {
    padding: 16px;
    font-size: 20px;
    cursor: pointer;
    text-align: center;
    background: var(--btn-soft);
    transition: background 0.15s ease;
    color: var(--text-link);
}

.dropdown-item.active {
    background: var(--btn-active);
    font-weight: 700;
}
</style>