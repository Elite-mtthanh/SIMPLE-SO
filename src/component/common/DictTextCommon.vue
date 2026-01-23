<template>
  <span>{{ text }}</span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { AppConfig } from '@/model/AppConfig';
import { ServiceIF } from '@/services/ServiceIF';

export default defineComponent({
  name: 'DictTextCommon',
  props: {
    keyName: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const dict = computed(() => ServiceIF.getDict(props.keyName));

    const text = computed(() => {
      const d = dict.value;
      if (!d) return '';

      const lang = AppConfig.Instance.currentLang.value;
      return d.texts[lang] ?? '';
    });

    return { text };
  },
});
</script>
