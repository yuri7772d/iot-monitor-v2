<script setup>
import { ref, computed } from "vue";
definePageMeta({
  layout: false,
});

const input = ref({
  username: "",
  password: "",
  confirmPassword: "",
});

const passwordsMatch = computed(
  () => input.value.password === input.value.confirmPassword
);
</script>

<template>
  <div class="min-h-screen bg-stone-100 p-10">
    <div
      class="flex flex-col gap-3 max-w-sm p-6 mx-auto bg-white rounded-2xl shadow"
    >
      <h1 class="text-2xl font-bold text-center">สร้างบัญชี</h1>
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
        <input
        type="password"
        v-model="input.confirmPassword"
        placeholder="ยืนยัน รหัสผ่าน"
        class="border p-1 rounded-xl"
      />
     <p v-if="!passwordsMatch && input.confirmPassword" class="text-red-500">
        รหัสผ่านไม่ตรงกัน!
      </p>
      <button
        :disabled="!passwordsMatch"
        @click="register"
        class="bg-stone-950 text-white p-2 rounded-2xl"
      >
        ตกลง
      </button>
      <p class="text-sm">
        หรือคุณมีบัญชีอยู่เเล้วต้องการ
        <NuxtLink to="/login" class="text-stone-500 "
          > ลงชื่อเข้าใช้</NuxtLink>
          ?
      </p>
    </div>
  </div>
</template>

     