<script lang="ts" setup>
import type { Config } from "./utils/config";

const isConfigModalOpen = ref(false);
const appConfig = ref<Config>(await loadConfig());

const onUpdateConfig = async () => {
  appConfig.value = await loadConfig();
  isConfigModalOpen.value = false;
};
</script>

<template>
  <div class="drawer md:drawer-open">
    <NuxtLayout>
      <input id="left-sidebar-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        <Navbar :list_config="appConfig.snap" @open-config-modal="isConfigModalOpen = true" />
        <template v-if="isConfigModalOpen">
          <ConfigModal @close="isConfigModalOpen = false" @update-config="onUpdateConfig" />
        </template>

        <!-- Main Content -->
        <main class="flex-1 h-screen overflow-y-auto md:py-4 py-4 px-6 bg-base-200">
          <div class="min-h-[calc(100vh-250px)]">
            <NuxtPage />
          </div>
        </main>
      </div>
      <Sidebar />

    </NuxtLayout>
  </div>
</template>
