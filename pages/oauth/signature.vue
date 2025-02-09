<script lang="ts" setup>
import { rsaSign } from '~/utils/crypt';
import { toIsoString } from '~/utils/helpers';
import store from '~/utils/store';

const isTimestampAuto = ref(true);
const showResult = ref(false);
const timestamp = ref('');
const signature = ref('');

const generateSignature = () => {
  if (isTimestampAuto.value) {
    const date = new Date();
    timestamp.value = toIsoString(date);
  }

  if (!store.selectedConfig) {
    store.showErrorMessage('Please select a config first');
    showResult.value = false;
    return;
  }

  try {
    signature.value = rsaSign(store.selectedConfig.merchantID, timestamp.value, store.selectedConfig.privateKey);
    showResult.value = true;
  } catch (error: unknown) {
    console.log(error);
    store.showErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    showResult.value = false;
  }
};
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
        <input type="text" class="input input-md" v-model="timestamp" placeholder="2025-01-31 00:00:00+07" />
      </label>
    </Transition>

    <button type="button" class="btn btn-primary" @click="generateSignature">Generate</button>

    <Transition name="fade">
      <fieldset class="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box" v-if="showResult">
        <legend class="fieldset-legend">Result</legend>

        <label class="fieldset-label">Timestamp</label>
        <div class="join">
          <BtnCopy :data="timestamp" />
          <input type="text" class="input w-full" v-model="timestamp" placeholder="Timestamp" />
        </div>

        <label class="fieldset-label mt-3">Signature</label>
        <div class="join">
          <BtnCopy :data="signature" />
          <input type="text" class="input w-full" v-model="signature" placeholder="Signature" />
        </div>
      </fieldset>
    </Transition>
  </div>
</template>
