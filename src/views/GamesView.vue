<script setup lang="ts">
import { onMounted } from 'vue'
import { useGames } from '@/modules/useGames'

const { error, loading, games, fetchGames } = useGames()

onMounted(() => {
  fetchGames()
})
</script>

<template>
  <main class="w-full py-[2rem] px-[1rem] lg:px-[2rem]">
    <h1 class="text-3xl font-bold text-center mb-[2rem]">Games</h1>

    <span v-if="loading" class="loading loading-spinner loading-lg"></span>

    <div class="flex flex-wrap justify-center gap-6">
      <div v-for="game in games" :key="game.id" class="card bg-base-100 w-96 shadow-sm mb-4">
        <figure>
          <!-- Image URL -->
          <img :src="game.imageURL" alt="Game Image" />
        </figure>
        <div class="card-body">
          <!-- Title -->
          <h2 class="card-title">{{ game.title }}</h2>

          <!-- Description -->
          <p>{{ game.description }}</p>

          <!-- Platform and genre -->
          <div class="flex flex-wrap gap-2 mt-2">
            <span class="badge badge-primary">{{ game.platform }}</span>
            <span class="badge badge-secondary">{{ game.genre }}</span>
          </div>

          <!-- Price and Rating -->
          <div class="mt-2">
            <span class="font-semibold text-lg">${{ game.price.toFixed(2) }}</span>
            <div class="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="h-5 w-5 text-yellow-400"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v18m9-9H3"
                />
              </svg>
              <span>{{ game.rating }} / 5</span>
            </div>
          </div>

          <!-- Release Date -->
          <p class="text-sm text-gray-500">
            Released: {{ new Date(game.releaseDate).toLocaleDateString() }}
          </p>

          <!-- Card actions (e.g., edit button) -->
          <div class="card-actions justify-end mt-4">
            <button class="btn">Edit</button>
            <button class="btn bg-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
