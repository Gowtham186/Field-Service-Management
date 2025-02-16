import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices.js/user-slice'
import categoryReducer from './slices.js/category-slice'
import expertReducer from './slices.js/expert-slice'
import searchReducer from './slices.js/search-slice'
import customerReducer from './slices.js/customer-slice'
import serviceRequestReducer from './slices.js/service-request-slice'
import statsReducer from './slices.js/stats-slice'

const store = configureStore({
    reducer : {
        user : userReducer,
        category : categoryReducer,
        expert : expertReducer,
        search : searchReducer,
        customer : customerReducer,
        serviceRequest : serviceRequestReducer,
        stats : statsReducer
    }
})
export default store