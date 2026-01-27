<template>
  <PopupCommon>
    <div class="dialog-card">
      <div class="dialog-card-header" v-if="dialogArgs.title">
        <div
          v-if="dialogArgs.iconButton"
          class="dialog-card-message-icon"
        >
          <ImageView :src="dialogArgs.iconButton" alt="icon" />
        </div>
        <span class="dialog-card-header-title">
          <DictText :keyName="dialogArgs.title" />
        </span>
      </div>

      <div v-else class="dialog-card-message">
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
          'two-button': dialogArgs.buttons.length === 2,
          'one-button': dialogArgs.buttons.length === 1,
        }"
      >
        <ButtonCommon
          v-for="btn in dialogArgs.buttons"
          :key="btn.id"
          :id="btn.id"
          :type="getButtonCommonType(btn.id)"
          text-color="inverse"
          @mousedown="onMousedownClick"
        >
          <DictText :keyName="btn.text" />
        </ButtonCommon>
      </div>
    </div>
  </PopupCommon>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ButtonCommon from './ButtonCommon.vue';
import PopupCommon from './PopupCommon.vue';
import DictText from '@/component/common/DictText.vue';
import { GlobalEvent } from '@/logic/common/GlobalEvent';
import { DialogButtonId, DialogMessageType } from '@/model/Enums';
import { DialogArgs } from '@/model/Dialog';
import ImageView from './ImageView.vue';

export default defineComponent({
  name: 'GlobalDialog',
  components: {
    ButtonCommon,
    PopupCommon,
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
    const onMousedownClick = (id: DialogButtonId) => {
      props.dialogArgs.resolve?.(id);
      GlobalEvent.Instance.dismissCommonDialog();
    };

    const getButtonCommonType = (id: DialogButtonId) => {
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
      onMousedownClick,
      DialogButtonId,
      getButtonCommonType,
      getMessageType,
    };
  },
});
</script>

<style scoped>
.dialog-card {
  width: 1055px;
  min-height: 439px;
  background: var(--background-dialog);
  border-radius: 10px;
  padding: 40px 60px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dialog-card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

.dialog-card-header-title {
  min-height: 121px;
  width: 600px;
  font-size: 50px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-accent-dialog);
  display: flex;
  align-items: center;
  justify-content: start;
}

.dialog-card-message-icon {
  width: 100px;
  height: 100px;
  margin-right: 16px;
}

.dialog-card-message {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--text-accent-dialog);
  margin-bottom: 60px;
}

.dialog-card-message-content {
  display: inline-block;
  min-height: 121px;
  width: 600px;
  font-size: 50px;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
}

.dialog-card-actions {
  display: flex;
  align-items: center;
}

.dialog-card-actions.one-button {
  justify-content: center;
}

.dialog-card-actions.two-button {
  justify-content: space-between;
  padding: 0 40px;
}

.dialog-card-actions.two-button > * {
  min-width: 180px;
}

.dialog-card-actions.one-button > * {
  min-width: 200px;
}
</style>
