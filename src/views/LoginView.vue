<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUsers } from '@/modules/useUsers'

const { error, name, email, password, fetchToken } = useUsers()
</script>

<template>
  <main
    class="w-full min-h-[calc(100vh-65px)] py-[2rem] px-[1rem] lg:px-[2rem] flex flex-col justify-center items-center gap-[1rem]"
  >
    <div class="card w-96 bg-base-100 shadow-md p-6 mt-[-65px]">
      <h1 class="text-2xl font-bold text-center mb-4">Login</h1>
      <form class="space-y-4" @submit.prevent="fetchToken(email, password)">
        <!-- Email Field -->
        <div>
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            class="input input-bordered w-full"
            required
            v-model="email"
          />
        </div>

        <!-- Password Field -->
        <div>
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            class="input input-bordered w-full"
            required
            v-model="password"
          />
        </div>
        <button type="submit" class="btn btn-primary w-full">Login</button>
      </form>

      <!-- Additional Links -->
      <p class="text-center text-sm text-gray-500 mt-4">
        Don't have an account? <RouterLink to="/register" class="text-primary">Register</RouterLink>
      </p>
    </div>

    <!-- Error display -->
    <div v-if="error" role="alert" class="alert alert-error alert-soft w-96">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ error }}</span>
    </div>
  </main>
</template>

<style scoped></style>
