<template>
  <BaseOverlay>
    <div class="dialog-card">
      <div class="dialog-header" v-if="dialogArgs.title">
        <span class="dialog-title">
          <DictText :keyName="dialogArgs.title" />
        </span>
      </div>

      <p v-else class="dialog-message">
        <DictText :keyName="dialogArgs.message" :class="getMessageType()" />
      </p>

      <div class="dialog-actions" :class="{
        'two-buttons': dialogArgs.buttons.length === 2,
        'one-button': dialogArgs.buttons.length === 1
      }">
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
import { DialogArgs, DialogButtonId, DialogMessageType } from '@/model/Dialog';

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

    const getMessageType = () => {
      switch (props.dialogArgs.messageType) {
        case DialogMessageType.Default:
          return 'text-accent';
        case DialogMessageType.Success:
          return 'text-success';
        default:
          return 'text-link';
      }
    };

    return {
      onClick,
      DialogButtonId,
      getButtonType,
      getMessageType
    };
  },
});
</script>


<style scoped>
.dialog-card {
  width: auto;
  height: auto;
  background: var(--background-dialog);
  border-radius: 10px;
  padding: 30px 10px;
  box-sizing: border-box;
  text-align: center;
  min-width: 800px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
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
  margin-bottom: 80px;
}

.dialog-actions {
  margin-top: 28px;
  display: flex;
  align-items: center;
}

.dialog-actions.one-button {
  justify-content: center;
}

.dialog-actions.two-buttons {
  justify-content: space-between;
  padding: 0 40px;
}

.dialog-actions.two-buttons>* {
  min-width: 180px;
}

.dialog-actions.one-button>* {
  min-width: 200px;
}
</style>
