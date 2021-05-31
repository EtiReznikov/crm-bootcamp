import { configureStore } from '@reduxjs/toolkit'
import counter from './slices/counter'

/**
 * Combine all of your state's slices' reducers
 */
const rootReducer = {
    counter,
}

/**
 * Main Configuration of the application state management's Redux store
 */
const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production'
})

export default store;