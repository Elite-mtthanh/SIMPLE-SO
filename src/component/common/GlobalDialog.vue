<template>
  <BaseOverlay>
    <div class="dialog-card">
      <div class="dialog-header" v-if="dialogArgs.title">
        <span class="dialog-title">
          <DictText :keyName="dialogArgs.title" />
        </span>
      </div>

      <p v-else class="dialog-message">
        <DictText :keyName="dialogArgs.message" />
      </p>

      <div class="dialog-actions">
        <BaseButton v-for="btn in dialogArgs.buttons" :key="btn.id" :id="btn.id" :type="getButtonType(btn.id)"
          text-color="inverse" @confirm="onClick">
          <DictText :keyName="btn.text" />
        </BaseButton>
      </div>
    </div>
  </BaseOverlay>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import BaseButton from './BaseButton.vue';
import BaseOverlay from './BaseOverlay.vue';
import DictText from '@/component/common/DictText.vue';
import { GlobalEvent } from '@/logic/common/GlobalEvent';
import { DialogArgs, DialogButtonId } from '@/model/Dialog';

export default defineComponent({
  name: 'GlobalDialog',
  components: {
    BaseButton,
    BaseOverlay,
    DictText,
  },
  props: {
    dialogArgs: {
      type: Object as PropType<DialogArgs>,
      required: true,
    },
  },
  setup(props) {
    const onClick = (id: DialogButtonId) => {
      props.dialogArgs.resolve?.(id);
      GlobalEvent.Instance.dismissCommonDialog();
    };
    const getButtonType = (id: DialogButtonId) => {
      switch (id) {
        case DialogButtonId.Confirm:
          return 'primary';
        case DialogButtonId.Cancel:
        case DialogButtonId.Ok:
        default:
          return 'neutral';
      }
    };

    return {
      onClick,
      DialogButtonId,
      getButtonType
    };
  },
});
</script>


<style scoped>
.dialog-card {
  width: 520px;
  background: var(--background-dialog);
  border-radius: 10px;
  padding: 32px 28px;
  box-sizing: border-box;
  text-align: center;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.dialog-icon {
  font-size: 22px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
}

.dialog-message {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-accent);
  line-height: 1.4;
}

.dialog-actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
