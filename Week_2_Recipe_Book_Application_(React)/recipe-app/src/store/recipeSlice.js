import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchRecipes as fetchRecipesApi } from "../api/recipeApi.js";
import { fetchRecipeById as fetchRecipeByIdApi } from "../api/recipeApi.js";

export const Difficulty = {
	All: "All",
	Easy: "Easy",
	Medium: "Medium",
	Hard: "Hard",
};

export const fetchRecipes = createAsyncThunk(
	"recipes/fetchRecipes",
	async (_, { getState }) => {
		const { keyword, currentPage } = getState().recipes;
		return await fetchRecipesApi(keyword, currentPage);
	},
);

export const fetchRecipeById = createAsyncThunk(
	"recipes/fetchRecipeById",
	async (id) => {
		return await fetchRecipeByIdApi(id);
	},
);

const recipeSlice = createSlice({
	name: "recipes",
	initialState: {
		filter: Difficulty.All,
		keyword: "",
		recipes: [],
		loading: false,
		currentPage: 0,
		selectedRecipe: null,
		selectedRecipeLoading: false,
	},
	reducers: {
		setFilter: (state, action) => {
			state.filter = action.payload;
		},
		setKeyword: (state, action) => {
			state.keyword = action.payload;
			state.recipes = [];
		},
		incrementPage: (state) => {
			state.currentPage += 1;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRecipes.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchRecipes.fulfilled, (state, action) => {
				state.loading = false;

				const recipesMap = new Map();

				state.recipes.forEach((item) => recipesMap.set(item.id, item));
				action.payload.forEach((item) => recipesMap.set(item.id, item));
				state.recipes = Array.from(recipesMap.values());
			})
			.addCase(fetchRecipes.rejected, (state) => {
				state.loading = false;
			})

			.addCase(fetchRecipeById.pending, (state) => {
				state.selectedRecipeLoading = true;
			})
			.addCase(fetchRecipeById.fulfilled, (state, action) => {
				state.selectedRecipeLoading = false;
				state.selectedRecipe = action.payload;
			})
			.addCase(fetchRecipeById.rejected, (state) => {
				state.selectedRecipeLoading = false;
			});
	},
});

export const { setFilter, setKeyword, incrementPage } = recipeSlice.actions;
export default recipeSlice.reducer;
