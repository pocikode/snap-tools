<script lang="ts" setup>
import { load } from "@tauri-apps/plugin-store";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { fetchAccessTokenB2B, fetchQrMPMGenerate } from "~/utils/api";
import store from "~/utils/store";

interface QrConfig {
  isDynamic: boolean;
  amount: number;
  callbackUrl: string;
}

const qrConfig = await load("qr.json", { autoSave: true });
const loading = ref(false);
const loadingState = ref("");
const showResult = ref(false);
const accessToken = ref("");
const referenceNo = ref("");
const isDynamic = ref(false);
const amount = ref(0);
const callbackUrl = ref("");
const qrContent = ref("");
const qrContentUrl = ref("");

onMounted(async () => {
  const existingConfig = await qrConfig.get<QrConfig>("qr_payload");
  if (existingConfig) {
    isDynamic.value = existingConfig.isDynamic;
    amount.value = existingConfig.amount;
    callbackUrl.value = existingConfig.callbackUrl;
  }
});

const generateQrMPM = async () => {
  if (!store.selectedConfig) {
    store.showErrorMessage("Please select a config first");
    showResult.value = false;
    return;
  }

  loading.value = true;

  try {
    loadingState.value = "Generating Access Token B2B...";
    const result = await fetchAccessTokenB2B(
      store.selectedConfig.merchantID,
      store.selectedConfig.privateKey,
      store.selectedConfig.baseURL,
    );
    showResult.value = true;
    accessToken.value = result;
  } catch (error: unknown) {
    console.log(error);
    store.showErrorMessage(
      error instanceof Error ? error.message : "An error occurred",
    );
    showResult.value = false;
    loading.value = false;
    return;
  }

  try {
    loadingState.value = "Generating QR MPM...";
    referenceNo.value = `TESTING_${uuidv4()}`;
    const result = await fetchQrMPMGenerate(
      store.selectedConfig.merchantID,
      accessToken.value,
      referenceNo.value,
      callbackUrl.value,
      store.selectedConfig.baseURL,
      store.selectedConfig.secretKey,
      amount.value,
    );
    showResult.value = true;
    qrContent.value = result;

    await qrConfig.set("qr_payload", {
      isDynamic: isDynamic.value,
      amount: amount.value,
      callbackUrl: callbackUrl.value,
    });

    await QRCode.toDataURL(result, { errorCorrectionLevel: "H" }).then(
      (url: string) => {
        qrContentUrl.value = url;
      },
    );
  } catch (error: unknown) {
    console.log(error);
    store.showErrorMessage(
      error instanceof Error ? error.message : "An error occurred",
    );
    showResult.value = false;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <h1 class="text-xl font-semibold">QR MPM Generate</h1>
  <div class="flex flex-col gap-y-4 mt-2">
    <div class="flex items-center mt-2">
      <span class="shrink-1 font-semibold text-xs">Type:</span>
      <div class="flex items-center gap-x-2 pl-4">
        <input type="radio" name="qr_type" id="qr_static" :value="false" class="radio radio-xs" v-model="isDynamic" />
        <label for="timestamp-auto">QR Static</label>
      </div>
      <div class="flex items-center gap-x-2 pl-4">
        <input type="radio" name="qr_type" id="qr_dynamic" :value="true" class="radio radio-xs" v-model="isDynamic" />
        <label for="timestamp-auto">QR Dynamic</label>
      </div>
    </div>

    <Transition name="fade">
      <label class="floating-label" v-if="isDynamic">
        <span>Timestamp</span>
        <input type="number" class="input w-full" v-model="amount" placeholder="10000" />
      </label>
    </Transition>

    <label class="floating-label w-full">
      <span>Callback URL</span>
      <input type="text" v-model="callbackUrl" placeholder="https://google.com" class="input w-full" />
    </label>

    <button type="button" class="btn btn-primary mt-2" @click="generateQrMPM" :disabled="loading">
      <span class="loading loading-spinner loading-xs" v-show="loading"></span>
      <span class="">Generate</span>
    </button>

    <Transition name="fade">
      <div class="flex" v-if="loading">
        <span class="loading loading-spinner loading-xs"></span>
        <span class="ml-2">{{ loadingState }}</span>
      </div>
    </Transition>

    <Transition name="fade">
      <fieldset class="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box" v-if="showResult">
        <legend class="fieldset-legend">Result</legend>

        <label class="fieldset-label">Partner Reference No</label>
        <div class="join">
          <BtnCopy :data="referenceNo" />
          <input type="text" class="input w-full" v-model="referenceNo" placeholder="Partner Reference No" />
        </div>

        <label class="fieldset-label mt-3">QR Content</label>
        <div class="join">
          <BtnCopy :data="qrContent" />
          <input type="text" class="input w-full" v-model="qrContent" />
        </div>

        <img :src="qrContentUrl" alt="QR MPM" class="mt-3 ">
      </fieldset>
    </Transition>
  </div>
</template>
