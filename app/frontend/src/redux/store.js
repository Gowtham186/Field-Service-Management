import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices.js/user-slice'
const store = configureStore({
    reducer : {
        user : userReducer
    }
})
export default store