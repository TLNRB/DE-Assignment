<script setup lang="ts">
import { ref } from 'vue';
import { defineEmits } from 'vue';

const selectedPlatform = ref<string>('');

const availablePlatforms = ref<string[]>([
   'PC',
   'PlayStation',
   'Xbox',
   'Nintendo Switch',
   'Mobile',
]);

const emit = defineEmits(['filter', 'fetch']);

const filterGames = (event?: Event) => {
   if (!selectedPlatform.value) emit('fetch');
   else emit('filter', selectedPlatform.value);
};
</script>

<template>
   <div class="flex items-center gap-2 relative w-full sm:w-fit">
      <div class=" relative w-full sm:w-[200px]">
         <select id="platform-select" v-model="selectedPlatform" @change="filterGames"
            class="select select-bordered w-full text-black">
            <option value="Select a platform" disabled selected>Select a platform</option>
            <option v-for="platform in availablePlatforms" :key="platform" :value="platform">
               {{ platform }}
            </option>
         </select>
      </div>
      <!-- Clear filter button -->
      <button v-if="selectedPlatform" @click="selectedPlatform = ''; filterGames()" class="btn btn-secondary">
         Clear Filter
      </button>
   </div>
</template>

<style scoped>
select option:disabled {
   color: gray;
   /* Change the color to make it visible */
   font-style: italic;
   /* Optional: to distinguish it as a placeholder */
}
</style>
