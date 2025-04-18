<script setup lang="ts">
import { onMounted } from 'vue'
import { useGames } from '@/modules/useGames'
import Searchbar from '@/components/Searchbar.vue'
import Filter from '@/components/Filter.vue'

const { error, filterMessage, loading, games, fetchGames, filterGamesByPlatform, searchGamesByTitle } = useGames()

onMounted(() => {
  fetchGames()
})
</script>

<template>
  <main class="w-full py-[2rem] px-[1rem] lg:px-[2rem]">
    <h1 class="mb-[2rem] text-3xl font-bold text-center">Games</h1>

    <div class="w-full flex flex-col justify-center items-center gap-4 mb-8 sm:flex-row sm:flex-wrap">
      <Searchbar @search="searchGamesByTitle" @fetch="fetchGames" />
      <Filter @filter="filterGamesByPlatform" @fetch="fetchGames" />
    </div>

    <!-- Filter message -->
    <div v-if="filterMessage" class="w-full flex justify-center mb-8">
      <div role="info" class="alert alert-info alert-soft w-full md:w-[734px]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ filterMessage }}</span>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="flex justify-center items-center mb-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error display -->
    <div v-else-if="error" role="alert" class="alert alert-error alert-soft">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Game cards -->
    <div v-if="!error && !filterMessage && !loading" class="flex flex-wrap justify-center gap-6">
      <div v-for="game in games" :key="game._id" class="card bg-base-100 w-96 shadow-sm mb-4">
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                class="h-5 w-5 text-yellow-400">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
              <span>{{ game.rating }} / 5</span>
            </div>
          </div>
          <!-- Release Date -->
          <p class="text-sm text-gray-500">
            Released: {{ new Date(game.releaseDate).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
