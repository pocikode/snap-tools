<script lang="ts" setup>
import store from '~/utils/store';
</script>

<template>
  <h1>Home</h1>
  <p>Selected Config: {{ store.selectedConfig?.name }}</p>
</template>
