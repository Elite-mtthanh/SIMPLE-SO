<template>
    <div class="overlay-mask" @click.self="onMaskClick">
        <div class="overlay-content">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'BaseOverlay',
    props: {
        closeOnMask: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['close'],
    setup(props, { emit }) {
        const onMaskClick = () => {
            if (props.closeOnMask) {
                emit('close');
            }
        };

        return {
            onMaskClick,
        };
    },
});
</script>

<style scoped>
.overlay-mask {
    position: fixed;
    inset: 0;
    z-index: 9999;

    background: rgba(0, 0, 0, 0.8);

    display: flex;
    align-items: center;
    justify-content: center;
}

.overlay-content {
    max-width: 90%;
    max-height: 90%;
}
</style>
