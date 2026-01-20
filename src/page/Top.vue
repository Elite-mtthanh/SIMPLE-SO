<template>
  <div class="top-main">
    <keep-alive>
      <component
        :is="currentPageName"
        :key="currentPageName"
        :page-args="currentPageArgs"
      />
    </keep-alive>

    <keep-alive v-if="commonDialogSettings.isShow && commonDialogSettings.info">
      <GlobalDialog :dialog-args="commonDialogSettings.info" />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TopLogic } from '@/logic/page/TopLogic';
import StartPage from '@/page/StartPage.vue';
import GlobalDialog from '@/component/common/GlobalDialog.vue';
import CategoryListPage from '@/page/CategoryListPage.vue';
import MenuListPage from './MenuListPage.vue';

export default defineComponent({
  name: 'top-page',
  components: {
    StartPage,
    GlobalDialog,
    CategoryListPage,
    MenuListPage
  },
  setup() {
    let logic = new TopLogic();
    return {
      currentPageName: logic.currentPageName,
      commonDialogSettings: logic.commonDialogSettings,
      currentPageArgs: logic.currentPageArgs,
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
