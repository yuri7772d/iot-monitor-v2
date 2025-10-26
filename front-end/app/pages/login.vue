<script setup>
import { ref, computed } from "vue";
definePageMeta({
  layout: false,
});

const input = ref({
  username: "",
  password: "",
});

async function login() {
  try {
    const res = await $fetch("/api/user/login", {
      method: "POST",
      body: input.value,
    });
console.log(res);
  } catch (error) {
    console.log(error.data.errors);
  }
}
</script>

<template>
  {{ input }}
  <div class="min-h-screen bg-stone-100 p-10">
    <div
      class="flex flex-col gap-3 max-w-sm p-6 mx-auto bg-white rounded-2xl shadow"
    >
      <h1 class="text-2xl font-bold text-center">ลงชื่อเข้าใช้</h1>
      <input
        type="text"
        v-model="input.username"
        placeholder="ชื่อ"
        class="border p-1 rounded-xl"
      />
      <input
        type="password"
        v-model="input.password"
        placeholder="รหัสผ่าน"
        class="border p-1 rounded-xl"
      />

      <button @click="login" class="bg-stone-950 text-white p-2 rounded-2xl">
        ตกลง
      </button>
      <p class="text-sm">
        หรือคุณไม่มีบัญชีต้องการ
        <NuxtLink to="/register" class="text-stone-500"
          >สร้างบัญชีไหม่</NuxtLink
        >
        ?
      </p>
    </div>
  </div>
</template>
