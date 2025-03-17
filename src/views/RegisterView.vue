<script setup lang="ts"></script>

<template>
  <main
    class="w-full min-h-[calc(100vh-65px)] py-[2rem] px-[1rem] lg:px-[2rem] flex justify-center items-center"
  >
    <div class="card w-96 bg-base-100 shadow-md p-6 mt-[-65px]">
      <h1 class="text-2xl font-bold text-center mb-4">Register</h1>
      <form class="space-y-4">
        <!-- Name Field -->
        <div>
          <label class="label">
            <span class="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            class="input input-bordered w-full"
            required
          />
        </div>

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
          />
        </div>
        <button type="submit" class="btn btn-primary w-full">Register</button>
      </form>

      <!-- Additional Links -->
      <p class="text-center text-sm text-gray-500 mt-4">
        Already have an account? <RouterLink to="/login" class="text-primary">Login</RouterLink>
      </p>
    </div>
  </main>
</template>

<style scoped></style>
