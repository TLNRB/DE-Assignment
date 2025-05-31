<script setup lang="ts">
import { ref } from 'vue';
import { defineEmits } from 'vue';

const searchQuery = ref<string>('');
let debounceTimer: number;

const emit = defineEmits(['search', 'fetch']);

const onSearchInput = (): void => {
   if (debounceTimer) clearTimeout(debounceTimer);

   debounceTimer = setTimeout(() => {
      if (searchQuery.value.trim() === '') {
         emit('fetch');
         return;
      }
      emit('search', searchQuery.value);
   }, 500);
}

const clearSearch = (): void => {
   searchQuery.value = '';
   emit('fetch');
}
</script>

<template>
   <div class="flex justify-center w-full sm:w-[400px]">
      <div class="relative w-full">
         <input name="search" type="text" placeholder="Search games..." v-model="searchQuery" @input="onSearchInput"
            class="input input-bordered w-full pl-10" />
         <!-- Search Icon -->
         <svg xmlns="http://www.w3.org/2000/svg"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
               d="M15 11a4 4 0 10-8 0 4 4 0 008 0zM21 21l-4.35-4.35" />
         </svg>

         <!-- Clear Icon -->
         <button v-if="searchQuery" @click="clearSearch"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
         </button>
      </div>
   </div>
</template>

<style scoped></style>
