import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from './recipeSlice';

export const makeStore = (preloadedState) => {
    return configureStore({
        reducer: {
            recipes: recipeReducer,
        },
        preloadedState,
    });
};