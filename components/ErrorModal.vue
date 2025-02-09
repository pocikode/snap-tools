<script lang="ts" setup>
import store from '~/utils/store';
</script>

<template>
  <dialog id="error_modal" class="modal modal-open">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="store.closeErrorMessage">✕</button>
      </form>
      <h3 class="text-lg text-center font-bold">

      </h3>
      <div class="flex justify-center">
        <svg class="w-14 h-14 text-error" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <p class="text-center py-4">{{ store.errorMessage }}</p>
    </div>
  </dialog>
</template>
