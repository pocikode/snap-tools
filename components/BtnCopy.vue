<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';

const props = defineProps<{
  data: string;
}>();

const { text, copy, copied, isSupported } = useClipboard({ source: props.data });
</script>

<template>
  <div class="tooltip" :data-tip="copied ? 'Copied!' : 'Copy'">
    <button type="button" class="btn btn-soft btn-info" @click="copy(props.data)">
      <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
        viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z" />
      </svg>
    </button>
  </div>
</template>
