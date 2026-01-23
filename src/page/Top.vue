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
      <GlobalDialogCommon :dialog-args="commonDialogSettings.info" />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { TopLogic } from '@/logic/page/TopLogic';
import { GlobalEvent } from '@/logic/common/GlobalEvent';
import StartPage from '@/page/StartPage.vue';
import GlobalDialogCommon from '@/component/common/GlobalDialogCommon.vue';
import CategoryListPage from '@/page/CategoryListPage.vue';
import MenuListPage from '@/page/MenuListPage.vue';

export default defineComponent({
  name: 'top-page',
  components: {
    StartPage,
    GlobalDialogCommon,
    CategoryListPage,
    MenuListPage,
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

    return {
      currentPageName: logic.currentPageName,
      commonDialogSettings: logic.commonDialogSettings,
      currentPageArgs: logic.currentPageArgs,
      pageKey,
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
