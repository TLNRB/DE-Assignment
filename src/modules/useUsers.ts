import { ref } from 'vue'
import type { User } from '@/types/types'

export const useUsers = () => {
   const token = ref<string | null>(null);
   const isLoggedIn = ref<boolean>(false);
   const error = ref<string | null>(null);
   const user = ref<User | null>(null);

   const name = ref<string | null>(null);
   const email = ref<string | null>(null);
   const password = ref<string | null>(null);

   const fetchToken = async (email: string, password: string): Promise<void> => {
      try {
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'auth-token': localStorage.getItem('token') || ''
            },
            body: JSON.stringify({ email, password })
         });

         if (!response.ok) {
            throw new Error('Invalid credentials');
         }
         else {
            const authData = await response.json();
            token.value = authData.data.token;
            user.value = authData.data.user;
            isLoggedIn.value = true;

            localStorage.setItem('token', authData.data.token);
            localStorage.setItem('userId', authData.data.user.id);

            console.log('User logged in: ', authData);
            console.log('Token: ', token.value);
         }
      }
      catch (err) {
         error.value = (err as Error).message || 'Failed to login';
         isLoggedIn.value = false;
      }
   }

   return { token, isLoggedIn, error, user, name, email, password, fetchToken }
}