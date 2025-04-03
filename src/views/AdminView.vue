<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Game, NewGame } from '@/types/types'
import { useGames } from '@/modules/useGames'
import Searchbar from '@/components/Searchbar.vue'
import Filter from '@/components/Filter.vue'

const {
  error,
  addError,
  updateError,
  filterMessage,
  loading,
  games,
  fetchGames,
  addGame,
  updateGame,
  deleteGame,
  filterGamesByPlatform,
  searchGamesByTitle
} = useGames()

//===== DELETE ===== //
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

//===== ADD ===== //
// Add modal state handling
const addModal = ref<HTMLDialogElement | null>(null)
const toggleAddModal = (): void => {
  clearNewGame()
  addModal.value?.open ? addModal.value?.close() : addModal.value?.show()
}

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
const handleAddGame = async (): Promise<void> => {
  addError.value = null

  await addGame(newGame.value, newGamePlatforms.value)

  if (!addError.value) {
    toggleAddModal()
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
  addError.value = null
}

//===== UPDATE ===== //
const updatedGamePlatforms = ref<Array<string>>([])
const updatedGame = ref<Game>({
  _id: '',
  title: '',
  description: '',
  imageURL: '',
  price: 0,
  rating: 0,
  platform: '',
  genre: '',
  releaseDate: '',
  _createdBy: '',
})

// Update modal state handling
const updateModal = ref<HTMLDialogElement | null>(null)

const toggleUpdateModal = (game: Game | null): void => {
  clearUpdatedGame()

  updateModal.value?.open ? updateModal.value?.close() : updateModal.value?.show()

  if (game) {
    updatedGame.value = { ...game }
    updatedGame.value.releaseDate = new Date(game.releaseDate).toISOString().split('T')[0]
    updatedGamePlatforms.value = game?.platform.split(', ') || []
  }
}

// Update game
const handleUpdateGame = async (): Promise<void> => {
  updateError.value = null

  const { _id, ...updatedGameData } = updatedGame.value
  await updateGame(updatedGame.value._id, updatedGameData, updatedGamePlatforms.value)

  if (!updateError.value) {
    toggleUpdateModal(null)
  }
}

// Clear updated game values
const clearUpdatedGame = (): void => {
  updatedGame.value = {
    _id: '',
    title: '',
    description: '',
    imageURL: '',
    price: 0,
    rating: 0,
    platform: '',
    genre: '',
    releaseDate: '',
    _createdBy: '',
  }
  updatedGamePlatforms.value = []
  updateError.value = null
}

onMounted(() => {
  fetchGames()
})
</script>

<template>
  <main class="w-full py-[2rem] px-[1rem] lg:px-[2rem]">
    <div class="relative flex justify-between items-center gap-[1rem] flex-wrap mb-[2rem] md:justify-center">
      <h1 class="text-3xl font-bold text-center">Admin</h1>
      <!-- Add game button -->
      <button @click="toggleAddModal" class="btn btn-soft btn-primary border-primary md:absolute md:right-0">
        Add Game
      </button>
    </div>

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
      <span class=" loading loading-spinner loading-lg"></span>
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
          <!-- Card actions -->
          <div class="card-actions justify-end mt-4">
            <button @click="toggleUpdateModal(game)" class="btn">Edit</button>
            <button @click="toggleDeleteModal(game.title, game._id)" class="btn btn-soft btn-error border-error">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Game Modal -->
    <dialog ref="addModal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Add New Game</h3>
        <form @submit.prevent="handleAddGame">
          <div class="py-4 flex flex-col gap-[.5rem]">
            <label class="w-full">
              <span class="text-sm">Title</span>
              <input type="text" placeholder="Title" v-model="newGame.title" class="input input-md w-full" required />
            </label>

            <label class="w-full">
              <span class="text-sm">Description</span>
              <textarea v-model="newGame.description" placeholder="Description"
                class="textarea textarea-bordered w-full" required></textarea>
            </label>

            <label class="w-full">
              <span class="text-sm">Price</span>
              <input type="number" placeholder="Price" v-model.number="newGame.price" class="input input-md w-full"
                min="0" step="0.01" required />
            </label>

            <label class="w-full">
              <span class="text-sm">Rating (0-5)</span>
              <input type="number" placeholder="Rating (0-5)" v-model.number="newGame.rating"
                class="input input-md w-full" min="0" max="5" step="0.1" required />
            </label>

            <fieldset class="w-full">
              <span class="text-sm">Platforms</span>
              <div class="grid grid-cols-2 gap-2">
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="newGamePlatforms" value="PC" class="checkbox checkbox-primary" />
                  PC
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="newGamePlatforms" value="PlayStation"
                    class="checkbox checkbox-primary" />
                  PlayStation
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="newGamePlatforms" value="Xbox" class="checkbox checkbox-primary" />
                  Xbox
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="newGamePlatforms" value="Nintendo Switch"
                    class="checkbox checkbox-primary" />
                  Nintendo Switch
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="newGamePlatforms" value="Mobile" class="checkbox checkbox-primary" />
                  Mobile
                </label>
              </div>
            </fieldset>

            <label class="w-full">
              <span class="text-sm">Genre</span>
              <input type="text" placeholder="Genre" v-model="newGame.genre" class="input input-md w-full" required />
            </label>

            <label class="w-full">
              <span class="text-sm">Release Date</span>
              <input type="date" placeholder="Release Date" v-model="newGame.releaseDate" class="input input-md w-full"
                required />
            </label>
          </div>

          <!-- Error display -->
          <div v-if="addError" role="alert" class="alert alert-error alert-soft">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ addError }}</span>
          </div>
          <div class="modal-action">
            <button v-if="!loading" type="submit" class="btn btn-primary">Add</button>
            <button v-else class="btn btn-primary">
              <span class="loading loading-spinner"></span>
              loading
            </button>
            <button @click="toggleAddModal" type="button" class="btn">Cancel</button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Update Game Modal -->
    <dialog ref="updateModal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Update {{ updatedGame.title }}</h3>
        <form @submit.prevent="handleUpdateGame">
          <div class="py-4 flex flex-col gap-[.5rem]">
            <label class="w-full">
              <span class="text-sm">Title</span>
              <input type="text" placeholder="Title" v-model="updatedGame.title" class="input input-md w-full"
                required />
            </label>

            <label class="w-full">
              <span class="text-sm">Description</span>
              <textarea v-model="updatedGame.description" placeholder="Description"
                class="textarea textarea-bordered w-full" required></textarea>
            </label>

            <label class="w-full">
              <span class="text-sm">Price</span>
              <input type="number" placeholder="Price" v-model.number="updatedGame.price" class="input input-md w-full"
                min="0" step="0.01" required />
            </label>

            <label class="w-full">
              <span class="text-sm">Rating (0-5)</span>
              <input type="number" placeholder="Rating (0-5)" v-model.number="updatedGame.rating"
                class="input input-md w-full" min="0" max="5" step="0.1" required />
            </label>

            <fieldset class="w-full">
              <span class="text-sm">Platforms</span>
              <div class="grid grid-cols-2 gap-2">
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="updatedGamePlatforms" value="PC" class="checkbox checkbox-primary" />
                  PC
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="updatedGamePlatforms" value="PlayStation"
                    class="checkbox checkbox-primary" />
                  PlayStation
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="updatedGamePlatforms" value="Xbox"
                    class="checkbox checkbox-primary" />
                  Xbox
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="updatedGamePlatforms" value="Nintendo Switch"
                    class="checkbox checkbox-primary" />
                  Nintendo Switch
                </label>
                <label class="flex items-center gap-2">
                  <input type="checkbox" v-model="updatedGamePlatforms" value="Mobile"
                    class="checkbox checkbox-primary" />
                  Mobile
                </label>
              </div>
            </fieldset>

            <label class="w-full">
              <span class="text-sm">Genre</span>
              <input type="text" placeholder="Genre" v-model="updatedGame.genre" class="input input-md w-full"
                required />
            </label>

            <label class="w-full">
              <span class="text-sm">Release Date</span>
              <input type="date" placeholder="Release Date" v-model="updatedGame.releaseDate"
                class="input input-md w-full" required />
            </label>
          </div>

          <!-- Error display -->
          <div v-if="updateError" role="alert" class="alert alert-error alert-soft">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ updateError }}</span>
          </div>
          <div class="modal-action">
            <button v-if="!loading" type="submit" class="btn btn-primary">Update</button>
            <button v-else class="btn btn-primary">
              <span class="loading loading-spinner"></span>
              loading
            </button>
            <button @click="toggleUpdateModal(null)" type="button" class="btn">Cancel</button>
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
          <button v-if="!loading" @click="handleDeleteGame" class="btn btn-soft btn-error border-error">
            Delete
          </button>
          <button v-else class="btn btn-soft btn-error border-error">
            <span class="loading loading-spinner"></span>
            loading
          </button>
          <button @click="toggleDeleteModal(null, null)" class="btn">Cancel</button>
        </div>
      </div>
    </dialog>
  </main>
</template>

<style scoped></style>
