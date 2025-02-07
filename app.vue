<script lang="ts" setup>
const isConfigModalOpen = ref(false);
const isCreateConfig = ref(false);

const openConfigModal = (isCreate: boolean) => {
  isConfigModalOpen.value = true;
  isCreateConfig.value = isCreate;
};
</script>

<template>
  <div class="drawer md:drawer-open">
    <NuxtLayout>
      <input id="left-sidebar-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        <Navbar @open-config-modal="openConfigModal" />
        <template v-if="isConfigModalOpen">
          <ConfigModal @close="isConfigModalOpen = false" :is-create="isCreateConfig" />
        </template>

        <!-- Main Content -->
        <main class="flex-1 h-screen overflow-y-auto md:py-4 py-4 px-6 bg-base-200">
          <div class="min-h-[calc(100vh-250px)] text-sm">
            <NuxtPage />
          </div>
        </main>
      </div>
      <Sidebar />

    </NuxtLayout>
  </div>
</template>
