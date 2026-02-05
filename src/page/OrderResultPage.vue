<template>
  <div ref="pageEl" class="order-result anim-fade-scale">
    <div class="order-result-image">
      <ImageView
        v-if="success"
        src="/Image/order/human-order-complete.png"
        class="order-result-image-success"
      />
      <ImageView
        v-else
        src="/Image/order/human-order-error.png"
        class="order-result-image-error"
      />
    </div>

    <div class="order-result-subtext">
      <div class="order-result-subtext-success" v-if="success">
        <DictText keyName="ORDER_SUCCESS_MESSAGE" />
      </div>
      <div class="order-result-subtext-error" v-else>
        <DictText keyName="ORDER_ERROR_MESSAGE" />
        <DictText keyName="ORDER_ERROR_COMMENT" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  onActivated,
} from 'vue';
import DictText from '@/component/common/DictText.vue';
import ImageView from '@/component/common/ImageView.vue';
import { GlobalEvent } from '@/logic/common/GlobalEvent';
import { CartStorage } from '@/storage/CartStorage';
import { playEnter } from '@/util/AnimationUtil';
import { AppConfig } from '@/model/AppConfig';

export default defineComponent({
  name: 'OrderResultPage',
  components: { DictText, ImageView },

  setup() {
    const pageEl = ref<HTMLElement | null>(null);
    const success = ref(
      GlobalEvent.Instance.getCurrentPageArgs()?.Data?.success === true
    );
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const startTimer = () => {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
      timerId = setTimeout(goToStartPage, 5000);
    };

    const triggerEnterAnimation = () => playEnter(pageEl);

    const goToStartPage = () => {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
      const args = GlobalEvent.Instance.getCurrentPageArgs();
      const isSuccess = args?.Data?.success === true;
      if (isSuccess) {
        CartStorage.clear();
        GlobalEvent.Instance.emitEvent('cart-updated');
        AppConfig.Instance.currentLang.value = AppConfig.Instance.languages[0];
        GlobalEvent.Instance.showStartPage();
      } else {
        GlobalEvent.Instance.goToOrderListPage();
      }
    };

    onMounted(() => {
      success.value =
        GlobalEvent.Instance.getCurrentPageArgs()?.Data?.success === true;
      triggerEnterAnimation();
      startTimer();
    });

    onActivated(() => {
      success.value =
        GlobalEvent.Instance.getCurrentPageArgs()?.Data?.success === true;
      triggerEnterAnimation();
      startTimer();
    });

    onBeforeUnmount(() => {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    });

    return { pageEl, success };
  },
});
</script>

<style scoped>
.order-result {
  width: 100%;
  height: 100%;
  background: var(--background-app);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.order-result-image {
  margin-top: 116px;
}

.order-result-image-success {
  height: 600px;
  width: 400px;
}

.order-result-image-error {
  height: 600px;
  width: 400px;
}

.result-text {
  font-weight: 600;
  font-size: 100px;
  line-height: 18px;
  text-align: center;
}

.order-result-subtext {
  height: 334px;
  width: 1680px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.order-result-subtext-success {
  font-weight: 600;
  font-size: 100px;
  line-height: 18px;
  text-align: center;
  vertical-align: middle;
  color: var(--text-link);
}

.order-result-subtext-error {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  font-size: 100px;
  line-height: 120px;
  text-align: center;
  vertical-align: middle;
  color: var(--text-error);
}
</style>
