<script lang="ts" setup>
import store from '~/utils/store';

const props = defineProps<{
  isCreate: boolean;
}>();
const emit = defineEmits(['close']);

const config = ref<SnapConfig>({
  id: '',
  name: '',
  merchantID: '',
  secretKey: '',
  privateKey: '',
  baseURL: ''
})

if (!props.isCreate) {
  const selectedConfig = store.selectedConfig;
  if (selectedConfig) {
    config.value = selectedConfig;
  }
}


const errors = ref({
  name: '',
  merchantId: '',
  secretKey: '',
  privateKey: '',
  baseUrl: ''
});

const validate = () => {
  errors.value.name = config.value.name ? '' : 'Config Name cannot be empty';
  errors.value.merchantId = config.value.merchantID ? '' : 'Merchant ID cannot be empty';
  errors.value.secretKey = config.value.secretKey ? '' : 'Secret Key cannot be empty';
  errors.value.privateKey = config.value.privateKey ? '' : 'Private Key cannot be empty';
  errors.value.baseUrl = config.value.baseURL ? '' : 'Base URL cannot be empty';

  return !Object.values(errors.value).some(error => error);
};

const saveConfig = async () => {
  if (validate()) {
    if (props.isCreate) {
      config.value.id = uid();
      await addSnapConfig(config.value).then(() => {
        emit('close');
      });

      return;
    }

    await updateSnapConfig(config.value).then(() => {
      emit('close');
    });
  }
};
</script>

<template>
  <dialog class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ props.isCreate ? 'Add' : 'Edit' }} Config</h3>
      <div class="flex flex-col">
        <fieldset class="fieldset">
          <legend class="fieldset-legend w-full">Config Name</legend>
          <input type="text" class="input w-full" placeholder="Merchant Test 1" v-model="config.name" />
          <span class="fieldset-label text-error">{{ errors.name }}</span>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend w-full">Merchant ID</legend>
          <input type="text" class="input w-full" placeholder="xxx" v-model="config.merchantID" />
          <span class="fieldset-label text-error">{{ errors.merchantId }}</span>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend w-full">Secret Key</legend>
          <input type="text" class="input w-full" placeholder="rAnd0mStr1n6" v-model="config.secretKey" />
          <span class="fieldset-label text-error">{{ errors.secretKey }}</span>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend w-full">Private Key</legend>
          <textarea class="textarea h-24 w-full"
            placeholder="-----BEGIN PRIVATE KEY-----&#10;YouRPrivAt3Key....&#10;-----END PRIVATE KEY-----"
            v-model="config.privateKey"></textarea>
          <span class="fieldset-label text-error">{{ errors.privateKey }}</span>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend w-full">Base URL</legend>
          <input type="text" class="input w-full" placeholder="https://google.com" v-model="config.baseURL" />
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
