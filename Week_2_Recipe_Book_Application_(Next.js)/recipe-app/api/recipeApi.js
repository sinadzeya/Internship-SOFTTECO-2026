import axios from "axios";

const baseUrl = "https://dummyjson.com/recipes";

// Fetch recipes by keyword
export const fetchRecipes = async (
	searchKeyword = "",
	currentPage = 0,
	limit = 6,
) => {
	try {
		const skip = currentPage * limit;
		const trimmedKeyword = searchKeyword.trim();
		const endpoint = trimmedKeyword ? `${baseUrl}/search` : baseUrl;

		const response = await axios.get(endpoint, {
			params: {
				limit,
				skip,
				...(trimmedKeyword && { q: trimmedKeyword }),
			},
		});

		return {
			recipes: response.data.recipes || [],
			total: response.data.total || 0,
		};
	} catch (error) {
		console.error("Error fetching recipes:", error);
		return {
			recipes: [],
			total: 0,
		};
	}
};

// Fetch recipe by id
export const fetchRecipeById = async (recipeId) => {
	try {
		const response = await axios.get(`${baseUrl}/${recipeId}`);

		return response.data || null;
	} catch (error) {
		console.error("Error fetching recipe:", error);
		return [];
	}
};
