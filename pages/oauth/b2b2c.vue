<script lang="ts" setup>
import { load } from "@tauri-apps/plugin-store";
import { fetchAccessTokenB2B2C } from '~/utils/api';
import store from '~/utils/store';

interface B2B2CConfig {
  isAuthCode: boolean;
  checkData: string;
}

const b2b2cConfig = await load("b2b2c.json", { autoSave: true });
const loading = ref(false);
const showResult = ref(false);
const isAuthCode = ref(false);
const checkData = ref('');
const accessToken = ref('');
const refreshToken = ref('');

onMounted(async () => {
  const existingConfig = await b2b2cConfig.get<B2B2CConfig>("b2b2c_payload");
  if (existingConfig) {
    isAuthCode.value = existingConfig.isAuthCode;
    checkData.value = existingConfig.checkData;
  }
});

const getAccessTokenB2B2C = async () => {
  if (!store.selectedConfig) {
    store.showErrorMessage('Please select a config first');
    showResult.value = false;
    return;
  }

  loading.value = true;
  await fetchAccessTokenB2B2C(store.selectedConfig.merchantID, store.selectedConfig.privateKey, checkData.value, store.selectedConfig.baseURL, isAuthCode.value)
    .then((result) => {
      showResult.value = true;
      accessToken.value = result.accessToken;
      refreshToken.value = result.refreshToken;
    })
    .catch((error: unknown) => {
      console.log(error);
      store.showErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      showResult.value = false;
    })
    .finally(() => {
      loading.value = false;
    });

  b2b2cConfig.set('b2b2c_payload', { isAuthCode: isAuthCode.value, checkData: checkData.value });
};
</script>

<template>
  <h1 class="text-xl font-semibold">Get Access Token B2B2C</h1>

  <div class="flex flex-col gap-y-4 mt-4">
    <div class="flex items-center mt-2">
      <span class="shrink-1 font-semibold text-xs">Grant Type:</span>
      <div class="flex items-center gap-x-2 pl-4">
        <input type="radio" name="grant_type" id="qr_static" :value="false" class="radio radio-xs"
          v-model="isAuthCode" />
        <label for="timestamp-auto">Refresh Token</label>
      </div>
      <div class="flex items-center gap-x-2 pl-4">
        <input type="radio" name="grant_type" id="qr_dynamic" :value="true" class="radio radio-xs"
          v-model="isAuthCode" />
        <label for="timestamp-auto">Auth Code</label>
      </div>
    </div>

    <label class="floating-label w-full">
      <span>{{ isAuthCode ? 'Authorization Code' : 'Refresh Token' }}</span>
      <input type="text" v-model="checkData" class="input w-full" />
    </label>

    <button type="button" class="btn btn-primary" @click="getAccessTokenB2B2C" :disabled="loading">
      <span class="loading loading-spinner loading-xs" v-show="loading"></span>
      <span class="">Generate</span>
    </button>
    <Transition name="fade">
      <fieldset class="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box" v-if="showResult">
        <legend class="fieldset-legend">Result</legend>

        <label class="fieldset-label">Access Token B2B2C</label>
        <div class="join">
          <BtnCopy :data="accessToken" />
          <input type="text" class="input w-full" v-model="accessToken" placeholder="Access Token B2B2C" />
        </div>

        <label class="fieldset-label mt-3">Refresh Token B2B2C</label>
        <div class="join">
          <BtnCopy :data="refreshToken" />
          <input type="text" class="input w-full" v-model="refreshToken" placeholder="Refresh Token B2B2C" />
        </div>
      </fieldset>
    </Transition>
  </div>
</template>
