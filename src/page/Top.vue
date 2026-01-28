<template>
  <div class="top-main">
    <keep-alive>
      <component
        :is="currentPageName"
        :key="pageKey"
        :page-args="currentPageArgs"
      />
    </keep-alive>

    <keep-alive v-if="commonDialogSettings.isShow && commonDialogSettings.info">
      <GlobalDialog :dialog-args="commonDialogSettings.info" />
    </keep-alive>

    <keep-alive>
      <OrderListDialog
        v-if="orderListDialogSettings.isShow"
        @close="onCloseOrderList"
      />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { TopLogic } from '@/logic/page/TopLogic';
import { GlobalEvent } from '@/logic/common/GlobalEvent';
import StartPage from '@/page/StartPage.vue';
import GlobalDialog from '@/component/common/GlobalDialog.vue';
import CategoryListPage from '@/page/CategoryListPage.vue';
import MenuListPage from '@/page/MenuListPage.vue';
import OrderListDialog from '@/component/OrderListDialog.vue';

export default defineComponent({
  name: 'top-page',
  components: {
    StartPage,
    GlobalDialog,
    CategoryListPage,
    MenuListPage,
    OrderListDialog,
  },
  setup() {
    let logic = new TopLogic();

    const pageKey = computed(() => {
      const pageName = logic.currentPageName.value;
      if (pageName === 'MenuListPage') {
        const categoryCd = GlobalEvent.Instance.currentCategoryCd.value;
        return `${pageName}-${categoryCd}`;
      }
      return pageName;
    });

    const onCloseOrderList = () => {
      GlobalEvent.Instance.emitEvent('hide-order-list-dialog');
    };

    return {
      currentPageName: logic.currentPageName,
      commonDialogSettings: logic.commonDialogSettings,
      orderListDialogSettings: logic.orderListDialogSettings,
      currentPageArgs: logic.currentPageArgs,
      pageKey,
      onCloseOrderList,
    };
  },
});
</script>

<style>
.top-main {
  width: var(--display-resolution-width);
  height: var(--display-resolution-height);
  background-color: var(--background-app);
}
</style>
