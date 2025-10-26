<script setup>
const navItem = [{ title: "MyDevice", to: "/" }];
</script>
<template>
  <div class="flex">
    <div
      class="min-h-screen w-50 bg-stone-100 border-r border-stone-300 shadow"
    >
      <h1 class="text-2xl font-bold mb-4 border">IOT-MONITOR</h1>
      <div class="ml-3 flex flex-col border h-full">
        <ul>
          <li v-for="item in navItem">
            <NuxtLink :to="item.to">{{ item.title }}</NuxtLink>
          </li>
        </ul>
        <div class="justify-end">
          <button >ออกจากระบบ</button>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
