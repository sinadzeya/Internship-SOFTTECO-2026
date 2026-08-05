import {fetchRecipes as fetchRecipesApi} from '@/api/recipeApi';
import {Difficulty} from '@/store/recipeSlice';
import Providers from './providers';
import RecipeList from "./recipes/page";

export default async function HomePage() {

    const initialRecipes = await fetchRecipesApi('', 0);

    const initialReduxState = {
        recipes: {
            filter: Difficulty.All,
            keyword: '',
            recipes: initialRecipes,
            loading: false,
            currentPage: 0,
            selectedRecipe: null,
            selectedRecipeLoading: false,
        },
    };

    return (
        <Providers initialReduxState={initialReduxState}>
            <RecipeList/>
        </Providers>
    );
}