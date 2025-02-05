<template>
  <div class="drawer lg:drawer-open">
    <NuxtLayout>
      <input id="left-sidebar-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        <Navbar />
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