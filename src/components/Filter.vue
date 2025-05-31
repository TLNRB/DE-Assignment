<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';
import { defineEmits } from 'vue';

const props = defineProps({
   filter: { type: Array as PropType<string[]>, required: true },
   filterName: { type: String, required: true },
   filterNameLower: { type: String, required: true }
});

const selectedValue = ref<string>(`Select a ${props.filterName}`);

const emit = defineEmits(['filter', 'fetch']);

const filterGames = (event?: Event) => {
   if (!selectedValue.value) emit('fetch');
   else emit('filter', selectedValue.value);
};
</script>

<template>
   <div class="flex items-center gap-2 relative w-full sm:w-fit">
      <div class=" relative w-fit">
         <select :id="`${filterNameLower}-select`" v-model="selectedValue" @change="filterGames"
            class="select select-bordered w-full text-black">
            <option :value="`Select a ${filterName}`" disabled selected>Select a {{ filterName }}</option>
            <option v-for="item in filter" :key="item" :value="item">
               {{ item }}
            </option>
         </select>
      </div>
      <!-- Clear filter button -->
      <button v-if="selectedValue" @click="selectedValue = ''; filterGames()" class="btn btn-secondary">
         &times;
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
