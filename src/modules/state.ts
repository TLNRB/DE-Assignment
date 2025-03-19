import { reactive, watch } from "vue";

const isLoggedInFromLocalStorage: boolean = localStorage.getItem('isLoggedIn') === 'true'

export const state = reactive({
   isLoggedIn: isLoggedInFromLocalStorage,
})

watch(() => state.isLoggedIn, (newVal: boolean) => {
   localStorage.setItem('isLoggedIn', String(newVal))
})