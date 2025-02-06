<script lang="ts" setup>
const emit = defineEmits(['close', 'update-config']);

const name = ref('');
const merchantId = ref('');
const secretKey = ref('');
const privateKey = ref('');
const baseUrl = ref('');

const errors = ref({
  name: '',
  merchantId: '',
  secretKey: '',
  privateKey: '',
  baseUrl: ''
});

const validate = () => {
  errors.value.name = name.value ? '' : 'Config Name cannot be empty';
  errors.value.merchantId = merchantId.value ? '' : 'Merchant ID cannot be empty';
  errors.value.secretKey = secretKey.value ? '' : 'Secret Key cannot be empty';
  errors.value.privateKey = privateKey.value ? '' : 'Private Key cannot be empty';
  errors.value.baseUrl = baseUrl.value ? '' : 'Base URL cannot be empty';

  return !Object.values(errors.value).some(error => error);
};

const saveConfig = async () => {
  if (validate()) {
    const config: SnapConfig = {
      id: uid(),
      name: name.value,
      merchantID: merchantId.value,
      secretKey: secretKey.value,
      privateKey: privateKey.value,
      baseURL: baseUrl.value
    };

    await addSnapConfig(config).then(() => {
      emit('update-config');
    });
  }
};
</script>

<template>
  <!-- <dialog class="modal" :class="{ 'modal-open': open }"> -->
  <dialog class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Add Config</h3>
      <div class="flex flex-col">
        <fieldset class="fieldset">
          <legend class="fieldset-legend w-full">Config Name</legend>
          <input type="text" class="input w-full" placeholder="Merchant Test 1" v-model="name" />
          <span class="fieldset-label text-error">{{ errors.name }}</span>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend w-full">Merchant ID</legend>
          <input type="text" class="input w-full" placeholder="xxx" v-model="merchantId" />
          <span class="fieldset-label text-error">{{ errors.merchantId }}</span>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend w-full">Secret Key</legend>
          <input type="text" class="input w-full" placeholder="rAnd0mStr1n6" v-model="secretKey" />
          <span class="fieldset-label text-error">{{ errors.secretKey }}</span>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend w-full">Private Key</legend>
          <textarea class="textarea h-24 w-full"
            placeholder="-----BEGIN PRIVATE KEY-----&#10;YouRPrivAt3Key....&#10;-----END PRIVATE KEY-----"
            v-model="privateKey"></textarea>
          <span class="fieldset-label text-error">{{ errors.privateKey }}</span>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend w-full">Base URL</legend>
          <input type="text" class="input w-full" placeholder="https://google.com" v-model="baseUrl" />
          <span class="fieldset-label text-error">{{ errors.baseUrl }}</span>
        </fieldset>
      </div>

      <div class="modal-action">
        <form method="dialog" class="flex gap-x-2">
          <button type="button" class="btn btn-soft" @click="$emit('close')">Close</button>
          <button type="button" class="btn btn-primary" @click="saveConfig">Save</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
