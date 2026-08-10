import './globals.css';
import Providers from './providers';
import {fetchRecipes as fetchRecipesApi} from '@/api/recipeApi';
import {Difficulty} from "../store/recipeSlice";

export const metadata = {
    title: 'Recipe Finder',
    description: 'Search and browse delicious recipes',
};

export default async function RootLayout({children}) {

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
        <html lang="en">
            <body>
                <Providers initialReduxState={initialReduxState}>
                    {children}
                </Providers>
            </body>
        </html>
    );
}