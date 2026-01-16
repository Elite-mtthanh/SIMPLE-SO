<template>
  <BaseOverlay>
    <div class="dialog-card">
      <div class="dialog-card-header" v-if="dialogArgs.title">
        <span class="dialog-card-header-title">
          <DictText :keyName="dialogArgs.title" />
        </span>
      </div>

      <div v-else class="dialog-card-message">
        <div v-if="dialogArgs.iconButton" class="dialog-card-message-icon">
          <ImageView :src="dialogArgs.iconButton" alt="icon" />
        </div>
        <div class="dialog-card-message-content">
          <DictText :keyName="dialogArgs.message" :class="getMessageType()" />
          <div v-if="dialogArgs.comment">
            <DictText :keyName="dialogArgs.comment" :class="getMessageType()" />
          </div>
        </div>
      </div>

      <div
        class="dialog-card-actions"
        :class="{
          'two-buttons': dialogArgs.buttons.length === 2,
          'one-button': dialogArgs.buttons.length === 1,
        }"
      >
        <BaseButton
          v-for="btn in dialogArgs.buttons"
          :key="btn.id"
          :id="btn.id"
          :type="getButtonType(btn.id)"
          text-color="inverse"
          @confirm="onClick"
        >
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
import { DialogButtonId, DialogMessageType } from '@/model/Enums';
import { DialogArgs } from '@/model/Dialog';
import ImageView from './ImageView.vue';

export default defineComponent({
  name: 'GlobalDialog',
  components: {
    BaseButton,
    BaseOverlay,
    DictText,
    ImageView,
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
        case DialogMessageType.Error:
          return 'text-accent-dialog';
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
      getMessageType,
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
  min-width: 1055px;
}

.dialog-card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
}

.dialog-card-header-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
}

.dialog-card-message-icon {
  width: 68px;
  height: 68px;
}

.dialog-card-message {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-accent);
  line-height: 1.4;
  margin-bottom: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.dialog-card-message-content {
  display: flex;
  flex-direction: column;
}

.dialog-card-actions {
  margin-top: 28px;
  display: flex;
  align-items: center;
}

.dialog-card-actions.one-button {
  justify-content: center;
}

.dialog-card-actions.two-buttons {
  justify-content: space-between;
  padding: 0 40px;
}

.dialog-card-actions.two-buttons > * {
  min-width: 180px;
}

.dialog-card-actions.one-button > * {
  min-width: 200px;
}
</style>
