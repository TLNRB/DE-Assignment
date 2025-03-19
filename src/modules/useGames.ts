import { ref } from 'vue';
import type { Game, NewGame } from '@/types/types';

export const useGames = () => {
   const error = ref<string | null>(null);
   const addError = ref<string | null>(null);
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

   const getTokenAndUserId = (): { token: string, userId: string } => {
      const token: string | null = localStorage.getItem('token');
      const userId: string | null = localStorage.getItem('userId');

      if (!token) throw new Error('Not authenticated!');
      if (!userId) throw new Error('No user id available!');

      return { token, userId };
   }

   const validateGame = (game: NewGame, platforms: string[]): void => {
      if (platforms.length === 0) {
         throw new Error('Please select at least one platform!');
      }
   }

   const convertPlatformsArrayToString = (game: NewGame, platforms: string[]): void => {
      game.platform = platforms.join(', ');
   }

   const setDefaultValues = (game: NewGame, platforms: string[], userId: string): NewGame => {
      convertPlatformsArrayToString(game, platforms);

      return {
         title: game.title,
         description: game.description,
         imageURL: 'https://picsum.photos/500/500',
         price: game.price,
         rating: game.rating,
         platform: game.platform,
         genre: game.genre,
         releaseDate: game.releaseDate,
         _createdBy: userId,
      }
   }

   const addGame = async (game: NewGame, platforms: string[]): Promise<void> => {
      loading.value = true;

      try {
         const { token, userId } = getTokenAndUserId();

         validateGame(game, platforms);

         const newGame: NewGame = setDefaultValues(game, platforms, userId);

         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games`, {
            method: 'POST',
            headers: {
               'Content-type': 'application/json',
               'auth-token': token
            },
            body: JSON.stringify(newGame)
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to add game! ${errorData.error}`);
         }
         else {
            const game: Game = await response.json();
            games.value.push(game);

            console.log("Game added: ", game);

            await fetchGames();
         }
      }
      catch (err) {
         addError.value = (err as Error).message;
         loading.value = false;
      }
      finally {
         loading.value = false;
      }
   }

   const deleteGameFromServer = async (id: string, token: string): Promise<void> => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games/${id}`, {
         method: 'DELETE',
         headers: {
            'auth-token': token
         }
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(`Failed to delete game! ${errorData.error}`);
      }
   }

   const removeGameFromState = (id: string): void => {
      games.value = games.value.filter(game => game._id !== id);
      console.log("Game deleted by id: ", id);
   }

   const deleteGame = async (id: string): Promise<void> => {
      loading.value = true;

      try {
         const { token } = getTokenAndUserId();

         await deleteGameFromServer(id, token);
         removeGameFromState(id);
      }
      catch (err) {
         error.value = (err as Error).message;
      }
      finally {
         loading.value = false;
      }
   }

   return { error, addError, loading, games, fetchGames, addGame, deleteGame, getTokenAndUserId };
}