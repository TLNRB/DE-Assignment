import { ref } from 'vue';
import type { Game, NewGame } from '@/types/types';

export default function useGames() {
   const error = ref<string | null>(null);
   const loading = ref<boolean>(false);
   const games = ref<Game[]>([]);
}