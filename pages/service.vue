<script lang="ts" setup>
import { load } from '@tauri-apps/plugin-store';
import { SHA256 } from "crypto-js";
import store from '~/utils/store';

interface ServiceSignaturePayload {
  endpoint: string;
  accessToken: string;
  payload: string;
}

const configSignature = await load('service.json', { autoSave: true });
const loading = ref(false);
const showResult = ref(false);
const isTimestampAuto = ref(true);
const endpoint = ref('');
const accessToken = ref('');
const payload = ref('');
const timestamp = ref('');
const signature = ref('');

onMounted(async () => {
  const existingConfig = await configSignature.get<ServiceSignaturePayload>('service_signature_payload');
  if (existingConfig) {
    endpoint.value = existingConfig.endpoint;
    accessToken.value = existingConfig.accessToken;
    payload.value = existingConfig.payload;
  }
});

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

const generateSignature = () => {
  if (!store.selectedConfig) {
    store.showErrorMessage('Please select a config first');
    showResult.value = false;
    return;
  }

  try {
    if (isTimestampAuto.value) {
      timestamp.value = getTimestamp();
    }

    let stringToSign = `POST:${endpoint.value}`;
    if (accessToken.value) {
      stringToSign += `:${accessToken.value}`;
    }
    if (payload.value) {
      const payloadHash = SHA256(JSON.stringify(JSON.parse(payload.value))).toString();
      stringToSign += `:${payloadHash}`;
    }

    stringToSign += `:${timestamp.value}`;
    console.log(stringToSign);
    configSignature.set('service_signature_payload', {
      endpoint: endpoint.value,
      accessToken: accessToken.value,
      payload: payload.value,
    });

    signature.value = symmetricSign(stringToSign, store.selectedConfig.secretKey);
    showResult.value = true;
  } catch (error: unknown) {
    console.log(error);
    store.showErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    showResult.value = false;
  }
};
</script>

<template>
  <h1 class="text-xl font-semibold">Generate Service Signature</h1>
  <div class="flex flex-col gap-y-2 mt-2">
    <fieldset class="fieldset w-full">
      <legend class="fieldset-legend">Endpoint</legend>
      <label class="input w-full">
        <span class="label">POST</span>
        <input type="text" v-model="endpoint" placeholder="/openapi/v1.0/registration-account-binding" />
      </label>
    </fieldset>

    <fieldset class="fieldset w-full">
      <legend class="fieldset-legend">Access Token B2B</legend>
      <div class="join w-full">
        <BtnCopy :data="accessToken" />
        <input type="text" v-model="accessToken" class="input w-full" placeholder="eyJ0eXAiOiJKV1QiLCJhbGciOi..." />
        <button type="button" class="btn btn-soft btn-warning" @click="getAccessTokenB2B">
          <span class="loading loading-spinner loading-xs" v-show="loading"></span>
          <span v-show="!loading">Get Token</span>
        </button>
      </div>
    </fieldset>

    <fieldset class="fieldset w-full">
      <legend class="fieldset-legend">JSON Payload</legend>
      <textarea v-model="payload" class="textarea w-full h-36"
        placeholder="{&#10;&#9;&quot;grantType&quot;: &quot;client_credentials&quot;,&#10;&#9;&quot;additionalInfo&quot;:{}&#10;}"></textarea>
    </fieldset>

    <div class="flex items-center mt-2">
      <span class="shrink-1 font-semibold text-xs">Timestamp:</span>
      <div class="flex items-center gap-x-2 pl-4">
        <input type="radio" name="timestamp_generate" id="timestamp-auto" :value="true" class="radio radio-xs"
          v-model="isTimestampAuto" />
        <label for="timestamp-auto">Auto Generate</label>
      </div>
      <div class="flex items-center gap-x-2 pl-4">
        <input type="radio" name="timestamp_generate" id="timestamp-manual" :value="false" class="radio radio-xs"
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

    <button type="button" class="btn btn-primary mt-2" @click="generateSignature">Generate</button>

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
