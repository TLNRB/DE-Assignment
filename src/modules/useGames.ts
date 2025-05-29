import { ref } from 'vue';
import type { Game, NewGame } from '@/types/types';

export const useGames = () => {
   const error = ref<string | null>(null);
   const addError = ref<string | null>(null);
   const updateError = ref<string | null>(null);
   const loading = ref<boolean>(false);
   const games = ref<Game[]>([]);
   const filterMessage = ref<string | null>(null);

   const fetchGames = async (): Promise<void> => {
      filterMessage.value = null;
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

   const validateGame = (platforms: string[]): void => {
      if (platforms.length === 0) {
         throw new Error('Please select at least one platform!');
      }
   }

   const convertPlatformsArrayToString = (platforms: string[]): string => {
      const platform: string = platforms.join(', ');
      return platform;
   }

   const setDefaultValues = (game: NewGame, platforms: string[], userId: string): NewGame => {

      return {
         title: game.title,
         description: game.description,
         imageURL: 'https://picsum.photos/500/500',
         price: game.price,
         rating: game.rating,
         platform: convertPlatformsArrayToString(platforms),
         genre: game.genre,
         releaseDate: game.releaseDate,
         _createdBy: userId,
      }
   }

   const addGameToServer = async (newGame: NewGame, token: string): Promise<void> => {
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
         console.log("Game added: ", game);
      }
   }

   const addGame = async (game: NewGame, platforms: string[]): Promise<void> => {
      loading.value = true;

      try {
         const { token, userId } = getTokenAndUserId();

         validateGame(platforms);

         const newGame: NewGame = setDefaultValues(game, platforms, userId);

         await addGameToServer(newGame, token);

         await fetchGames();
      }
      catch (err) {
         addError.value = (err as Error).message;
         loading.value = false;
      }
      finally {
         loading.value = false;
      }
   }

   const updateGameOnServer = async (id: string, updatedGame: Partial<Game>, token: string): Promise<void> => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/games/${id}`, {
         method: 'PUT',
         headers: {
            'Content-type': 'application/json',
            'auth-token': token
         },
         body: JSON.stringify(updatedGame)
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(`Failed to update game! ${errorData.error}`);
      }
      else {
         const responseText = await response.text();
         console.log("Game updated: ", responseText);
      }
   }

   const updateGame = async (id: string, updatedGame: Partial<Game>, platforms: string[]): Promise<void> => {
      loading.value = true

      try {
         const { token } = getTokenAndUserId();

         validateGame(platforms)

         updatedGame.platform = convertPlatformsArrayToString(platforms);

         await updateGameOnServer(id, updatedGame, token);

         await fetchGames();
      }
      catch (err) {
         updateError.value = (err as Error).message;
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

   const deleteGame = async (id: string): Promise<void> => {
      loading.value = true;

      try {
         const { token } = getTokenAndUserId();

         await deleteGameFromServer(id, token);
         console.log("Game deleted by id: ", id);

         await fetchGames();
      }
      catch (err) {
         error.value = (err as Error).message;
      }
      finally {
         loading.value = false;
      }
   }

   const filterGamesByPlatform = async (platform: string): Promise<void> => {
      filterMessage.value = null;
      loading.value = true;

      try {
         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/query/games?field=platform&value=${platform}&populate=false`);

         if (!response.ok) {
            const errorText = await response.text();
            filterMessage.value = errorText;
            return;
         }

         const data: Game[] = await response.json();
         games.value = data;
         console.log("Games filtered by platform: ", games.value);
      }
      catch (err) {
         error.value = (err as Error).message;

      }
      finally {
         loading.value = false;
      }
   }

   const filterGamesByGenre = async (genre: string): Promise<void> => {
      filterMessage.value = null;
      loading.value = true;

      try {
         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/query/games?field=genre&value=${genre}&populate=false`);

         if (!response.ok) {
            const errorText = await response.text();
            filterMessage.value = errorText;
            return;
         }

         const data: Game[] = await response.json();
         games.value = data;
         console.log("Games filtered by genre: ", games.value);
      }
      catch (err) {
         error.value = (err as Error).message;

      }
      finally {
         loading.value = false;
      }
   }

   const searchGamesByTitle = async (title: string): Promise<void> => {
      filterMessage.value = null;
      loading.value = true;

      try {
         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/query/games?field=title&value=${title}&populate=false`);

         if (!response.ok) {
            const errorText = await response.text();
            filterMessage.value = errorText;
            return;
         }

         const data: Game[] = await response.json();
         games.value = data;
         console.log("Games filtered by title: ", games.value);
      }
      catch (err) {
         error.value = (err as Error).message;
      }
      finally {
         loading.value = false;
      }
   }

   return { error, addError, updateError, filterMessage, loading, games, fetchGames, addGame, updateGame, deleteGame, getTokenAndUserId, filterGamesByPlatform, filterGamesByGenre, searchGamesByTitle };
}