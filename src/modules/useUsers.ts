import { ref } from 'vue'
import type { User } from '@/types/types'
import { state } from '@/modules/state'

export const useUsers = () => {
   const loading = ref<boolean>(false);
   const token = ref<string | null>(null);
   const error = ref<string | null>(null);
   const user = ref<User | null>(null);

   const name = ref<string>('');
   const email = ref<string>('');
   const password = ref<string>('');

   const fetchToken = async (email: string, password: string): Promise<boolean> => {
      try {
         loading.value = true;

         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/login`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
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
            state.isLoggedIn = true;

            localStorage.setItem('token', authData.data.token);
            localStorage.setItem('userId', authData.data.userId);

            console.log('User logged in: ', authData);
            console.log('Token: ', token.value);

            return true;
         }
      }
      catch (err) {
         error.value = (err as Error).message || 'Failed to login';
         state.isLoggedIn = false;

         return false;
      }
      finally {
         loading.value = false;
      }
   }

   const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
      try {
         loading.value = true;

         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/register`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to register');
         }
         else {
            const authData = await response.json();

            console.log('User registered in: ', authData);

            return true;
         }
      }
      catch (err) {
         error.value = (err as Error).message || 'Failed to register';

         return false;
      }
      finally {
         loading.value = false;
      }
   }

   const logout = () => {
      token.value = null;
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');

      console.log('User logged out');
   }

   return { loading, token, isLoggedIn: state.isLoggedIn, error, user, name, email, password, fetchToken, registerUser, logout }
}