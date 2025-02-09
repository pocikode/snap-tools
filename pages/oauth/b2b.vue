<script lang="ts" setup>
import { fetchAccessTokenB2B } from '~/utils/api';
import store from '~/utils/store';

const loading = ref(false);
const showResult = ref(false);
const accessToken = ref('');

const getAccessTokenB2B = async () => {
  if (!store.selectedConfig) {
    store.showErrorMessage('Please select a config first');
    showResult.value = false;
    return;
  }

  loading.value = true;
  await fetchAccessTokenB2B(store.selectedConfig.merchantID, store.selectedConfig.privateKey, store.selectedConfig.baseURL)
    .then((result: string) => {
      showResult.value = true;
      accessToken.value = result;
    })
    .catch((error: unknown) => {
      console.log(error);
      store.showErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      showResult.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <h1 class="text-xl font-semibold">Get Access Token B2B</h1>

  <div class="flex flex-col gap-y-4 mt-4">
    <button type="button" class="btn btn-primary" @click="getAccessTokenB2B" :disabled="loading">
      <span class="loading loading-spinner loading-xs" v-show="loading"></span>
      <span class="">Generate</span>
    </button>
    <Transition name="fade">
      <fieldset class="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box" v-if="showResult">
        <legend class="fieldset-legend">Result</legend>

        <label class="fieldset-label">Access Token B2B</label>
        <div class="join">
          <BtnCopy :data="accessToken" />
          <input type="text" class="input w-full" v-model="accessToken" placeholder="Access Token B2B" />
        </div>
      </fieldset>
    </Transition>
  </div>
</template>
