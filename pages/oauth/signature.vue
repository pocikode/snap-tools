<script lang="ts" setup>
const isTimestampAuto = ref(true);
</script>

<template>
  <h1 class="text-xl font-semibold">Generate OAuth Signature</h1>
  <div class="flex flex-col gap-y-4 mt-4">
    <div class="flex">
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

    <Transition name="fade">
      <label class="floating-label" v-if="!isTimestampAuto">
        <span>Timestamp</span>
        <input type="text" placeholder="2025-01-31 00:00:00+07" class="input input-md" />
      </label>
    </Transition>

    <button type="button" class="btn btn-primary">Generate</button>
  </div>
</template>
