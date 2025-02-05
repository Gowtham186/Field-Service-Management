import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices.js/user-slice'
import categoryReducer from './slices.js/category-slice'
import expertReducer from './slices.js/expert-slice'
import searchReducer from './slices.js/search-slice'
import bookingReducer from './slices.js/booking-slice'

const store = configureStore({
    reducer : {
        user : userReducer,
        category : categoryReducer,
        expert : expertReducer,
        search : searchReducer,
        booking : bookingReducer
    }
})
export default store