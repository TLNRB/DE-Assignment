import { ref } from 'vue';
import type { Game, NewGame } from '@/types/types';

export const useGames = () => {
   const error = ref<string | null>(null);
   const loading = ref<boolean>(false);
   const games = ref<Game[]>([]);

   const fetchGames = async (): Promise<void> => {
      loading.value = true;

      try {
         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games`);

         if (!response.ok) {
            throw new Error('No data available!');
         }

         const data: Game[] = await response.json();
         games.value = data;
         console.log("Games fetched: ", games.value);
      }
      catch (err) {
         error.value = (err as Error).message;
      }
      finally {
         loading.value = false;
      }
   }

   return { error, loading, games, fetchGames };
}