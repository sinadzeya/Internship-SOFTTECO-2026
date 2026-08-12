import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchRecipes as fetchRecipesApi } from "@/api/recipeApi.js";
import { fetchRecipeById as fetchRecipeByIdApi } from "@/api/recipeApi.js";

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
	{
		condition: (_, { getState }) => {
			const { recipes = [], totalRecipes = 0, loading } = getState().recipes;

			if (loading) return false;

			return !(totalRecipes > 0 && recipes.length >= totalRecipes);
		},
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
		totalRecipes: 0,
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
			state.currentPage = 0;
			state.totalRecipes = 0;
		},
		incrementPage: (state) => {
			state.currentPage += 1;
		},
		setInitialRecipes: (state, action) => {
			state.recipes = action.payload.recipes;
			state.totalRecipes = action.payload.total;
			state.loading = false;
			state.currentPage = 0;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRecipes.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchRecipes.fulfilled, (state, action) => {
				state.loading = false;

				const incomingRecipes = action.payload?.recipes || [];
				state.totalRecipes = action.payload?.total || 0;

				const recipesMap = new Map();

				state.recipes.forEach((item) => recipesMap.set(item.id, item));
				incomingRecipes.forEach((item) => recipesMap.set(item.id, item));

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

export const { setFilter, setKeyword, incrementPage, setInitialRecipes } =
	recipeSlice.actions;
export default recipeSlice.reducer;
