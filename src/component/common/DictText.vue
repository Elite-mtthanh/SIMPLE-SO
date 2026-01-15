<template>
  <span>{{ text }}</span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { AppConfig } from '@/model/AppConfig';
import { ServiceIF } from '@/services/ServiceIF';

export default defineComponent({
  name: 'DictText',
  props: {
    keyName: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const dict = ServiceIF.getDict(props.keyName);

    const text = computed(() => {
      if (!dict) return '';

      const lang = AppConfig.Instance.currentLang.value;
      return dict.texts[lang] ?? '';
    });

    return {
      text,
    };
  },
});
</script>
