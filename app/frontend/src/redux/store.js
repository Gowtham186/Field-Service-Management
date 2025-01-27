import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices.js/user-slice'
import categoryReducer from './slices.js/category-slice'
import expertReducer from './slices.js/expert-slice'
const store = configureStore({
    reducer : {
        user : userReducer,
        category : categoryReducer,
        expert : expertReducer
    }
})
export default store