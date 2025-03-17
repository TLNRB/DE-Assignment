import { ref } from 'vue'
import type { User } from '@/types/types'

export const useUsers = () => {
   const token = ref<string | null>(null);
   const isLoggedIn = ref<boolean>(false);
   const error = ref<string | null>(null);
   const user = ref<User | null>(null);

   const name = ref<string>('');
   const email = ref<string>('');
   const password = ref<string>('');

   const fetchToken = async (email: string, password: string): Promise<void> => {
      try {
         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'auth-token': localStorage.getItem('token') || ''
            },
            body: JSON.stringify({ email, password })
         });
         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Invalid credentials');
         }
         else {
            const authData = await response.json();
            token.value = authData.data.token;
            isLoggedIn.value = true;

            localStorage.setItem('token', authData.data.token);
            localStorage.setItem('userId', authData.data.userId);

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