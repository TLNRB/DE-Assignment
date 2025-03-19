<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { NewGame } from '@/types/types'
import { useGames } from '@/modules/useGames'

const { error, addError, loading, games, fetchGames, addGame, deleteGame, getTokenAndUserId } =
  useGames()

// Delete modal state handling
const deleteModal = ref<HTMLDialogElement | null>(null)
const deleteTitle = ref<string | null>(null)
const deleteId = ref<string | null>(null)

const toggleDeleteModal = (title: string | null, id: string | null): void => {
  deleteModal.value?.open ? deleteModal.value?.close() : deleteModal.value?.show()
  deleteTitle.value = title
  deleteId.value = id
}

// Delete game
const handleDeleteGame = async (): Promise<void> => {
  if (deleteId.value) {
    await deleteGame(deleteId.value)
    toggleDeleteModal(null, null)
  }
}

// Add modal state handling
const addGameModal = ref<HTMLDialogElement | null>(null)
const toggleAddGameModal = (): void => {
  clearNewGame()
  addGameModal.value?.open ? addGameModal.value?.close() : addGameModal.value?.show()
}

// New game state
const newGamePlatforms = ref<Array<string>>([])
const newGame = ref<NewGame>({
  title: '',
  description: '',
  imageURL: '',
  price: 0,
  rating: 0,
  platform: '',
  genre: '',
  releaseDate: '',
  _createdBy: undefined,
})

// Add new game
const handleAddGame = async () => {
  addError.value = null

  await addGame(newGame.value, newGamePlatforms.value)

  if (!addError.value) {
    toggleAddGameModal()
  }
}

// Clear new game form
const clearNewGame = (): void => {
  newGame.value = {
    title: '',
    description: '',
    imageURL: '',
    price: 0,
    rating: 0,
    platform: '',
    genre: '',
    releaseDate: '',
    _createdBy: undefined,
  }
  newGamePlatforms.value = []
}

onMounted(() => {
  fetchGames()
})
</script>

<template>
  <main class="w-full py-[2rem] px-[1rem] lg:px-[2rem]">
    <div
      class="relative flex justify-between items-center gap-[1rem] flex-wrap mb-[2rem] md:justify-center"
    >
      <h1 class="text-3xl font-bold text-center">Admin</h1>
      <!-- Add game button -->
      <button
        @click="toggleAddGameModal"
        class="btn btn-soft btn-primary border-primary md:absolute md:right-0"
      >
        Add Game
      </button>
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="flex justify-center items-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Error display -->
    <div v-else-if="error" role="alert" class="alert alert-error alert-soft">
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

    <!-- Game cards -->
    <div v-else class="flex flex-wrap justify-center gap-6">
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
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14l-5-4.87 6.91-1.01L12 2z"
                />
              </svg>
              <span>{{ game.rating }} / 5</span>
            </div>
          </div>
          <!-- Release Date -->
          <p class="text-sm text-gray-500">
            Released: {{ new Date(game.releaseDate).toLocaleDateString() }}
          </p>
          <!-- Card actions -->
          <div class="card-actions justify-end mt-4">
            <button class="btn">Edit</button>
            <button
              @click="toggleDeleteModal(game.title, game._id)"
              class="btn btn-soft btn-error border-error"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Game Modal -->
    <dialog ref="addGameModal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Add New Game</h3>
        <form @submit.prevent="handleAddGame">
          <div class="py-4 flex flex-col gap-[.5rem]">
            <label class="w-full">
              <span class="text-sm">Title</span>
              <input
                type="text"
                placeholder="Title"
                v-model="newGame.title"
                class="input input-md w-full"
                required
              />
            </label>

            <label class="w-full">
              <span class="text-sm">Description</span>
              <textarea
                v-model="newGame.description"
                placeholder="Description"
                class="textarea textarea-bordered w-full"
                required
              ></textarea>
            </label>

            <label class="w-full">
              <span class="text-sm">Price</span>
              <input
                type="number"
                placeholder="Price"
                v-model.number="newGame.price"
                class="input input-md w-full"
                min="0"
                required
              />
            </label>

            <label class="w-full">
              <span class="text-sm">Rating (0-5)</span>
              <input
                type="number"
                placeholder="Rating (0-5)"
                v-model.number="newGame.rating"
                class="input input-md w-full"
                min="0"
                max="5"
                step="0.1"
                required
              />
            </label>

            <fieldset class="w-full">
              <span class="text-sm">Platforms</span>
              <div class="grid grid-cols-2 gap-2">
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="newGamePlatforms"
                    value="PC"
                    class="checkbox checkbox-primary"
                  />
                  PC
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="newGamePlatforms"
                    value="PlayStation"
                    class="checkbox checkbox-primary"
                  />
                  PlayStation
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="newGamePlatforms"
                    value="Xbox"
                    class="checkbox checkbox-primary"
                  />
                  Xbox
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="newGamePlatforms"
                    value="Nintendo Switch"
                    class="checkbox checkbox-primary"
                  />
                  Nintendo Switch
                </label>
                <label class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    v-model="newGamePlatforms"
                    value="Mobile"
                    class="checkbox checkbox-primary"
                  />
                  Mobile
                </label>
              </div>
            </fieldset>

            <label class="w-full">
              <span class="text-sm">Genre</span>
              <input
                type="text"
                placeholder="Genre"
                v-model="newGame.genre"
                class="input input-md w-full"
                required
              />
            </label>

            <label class="w-full">
              <span class="text-sm">Release Date</span>
              <input
                type="date"
                placeholder="Release Date"
                v-model="newGame.releaseDate"
                class="input input-md w-full"
                required
              />
            </label>
          </div>

          <!-- Error display -->
          <div v-if="addError" role="alert" class="alert alert-error alert-soft">
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
            <span>{{ addError }}</span>
          </div>
          <div class="modal-action">
            <button v-if="!loading" type="submit" class="btn btn-primary">Add Game</button>
            <button v-else class="btn btn-primary">
              <span class="loading loading-spinner"></span>
              loading
            </button>
            <button @click="toggleAddGameModal" type="button" class="btn">Close</button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Delete modal -->
    <dialog ref="deleteModal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Delete {{ deleteTitle }}</h3>
        <p class="py-4">Are you sure you want to delete the game {{ deleteTitle }}?</p>
        <div class="modal-action">
          <button
            v-if="!loading"
            @click="handleDeleteGame"
            class="btn btn-soft btn-error border-error"
          >
            Delete
          </button>
          <button v-else class="btn btn-soft btn-error border-error">
            <span class="loading loading-spinner"></span>
            loading
          </button>
          <button @click="toggleDeleteModal(null, null)" class="btn">Close</button>
        </div>
      </div>
    </dialog>
  </main>
</template>

<style scoped></style>
