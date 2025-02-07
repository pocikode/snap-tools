<script lang="ts" setup>
const isTimestampAuto = ref(true);
</script>

<template>
  <h1 class="text-xl font-semibold">Generate OAuth Signature</h1>
  <div class="flex flex-col">
    <div class="flex mt-3">
      <span class="shrink-1">Timestamp:</span>
      <div class="flex gap-x-2 pl-4">
        <input type="radio" name="timestamp_generate" id="timestamp-auto" :value="true" class="radio"
          v-model="isTimestampAuto" />
        <label for="timestamp-auto">Auto Generate</label>
      </div>
      <div class="flex gap-x-2 pl-4">
        <input type="radio" name="timestamp_generate" id="timestamp-manual" :value="false" class="radio"
          v-model="isTimestampAuto" />
        <label for="timestamp-auto">Input Timestamp</label>
      </div>
    </div>
  </div>
  <label class="floating-label">
    <span>Timestamp</span>
    <input type="text" placeholder="2025-01-31 00:00:00+07" class="input input-md" />
  </label>
</template>
