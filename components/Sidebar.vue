<script setup lang="ts">
import { NuxtLink } from '#components';

</script>

<template>
  <div class="drawer-side z-30 shadow">
    <label for="left-sidebar-drawer" class="drawer-overlay"></label>
    <aside class="h-screen w-3xs bg-base-100">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-3 px-8 py-3 text-3xl font-bold">
          <h1 class="text-blue-400">SNAP TOOLS</h1>
        </NuxtLink>

        <!-- Main Menu -->
        <ul class="menu p-4 flex-grow space-y-1">
          <li>
            <details>
              <summary class="space-x-3 items-center font-semibold">
                <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd"
                    d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
                    clip-rule="evenodd" />
                </svg>
                <span>OAuth</span>
              </summary>
              <ul>
                <li>
                  <NuxtLink href="/oauth/signature">Signature</NuxtLink>
                </li>
                <li>
                  <NuxtLink href="/oauth/b2b">Access Token B2B</NuxtLink>
                </li>
                <li>
                  <NuxtLink href="/oauth/b2b2c">Access Token B2B2C</NuxtLink>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <NuxtLink to="/service" class="flex space-x-3 items-center font-semibold">
              <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 12a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1M5 12h14M5 12a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1m-2 3h.01M14 15h.01M17 9h.01M14 9h.01" />
              </svg>
              <span>Service Signature</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/qr-mpm" class="flex space-x-3 items-center font-semibold">
              <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linejoin="round" stroke-width="2"
                  d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z" />
                <path stroke="currentColor" stroke-linejoin="round" stroke-width="2"
                  d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z" />
              </svg>

              <span>QR MPM</span>
            </NuxtLink>
          </li>
        </ul>

        <div class="p-4">
          <p class="text-sm font-semibold">Credit: pocikode</p>
        </div>
      </div>
    </aside>
  </div>
</template>
