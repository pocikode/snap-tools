<script lang="ts" setup>
import store from '~/utils/store';
</script>

<template>
  <!-- <div>
        <NuxtRouteAnnouncer />
        <NuxtWelcome />
    </div> -->
  <h1>Home</h1>
  <p>Selected Config: {{ store.selectedConfig?.name }}</p>
</template>
