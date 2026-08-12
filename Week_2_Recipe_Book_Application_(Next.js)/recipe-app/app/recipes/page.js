import RecipeListClient from "@/components/RecipeListClient";
import { fetchRecipes as fetchRecipesApi } from "@/api/recipeApi";
import { Message } from "@/components/ui";
import { Suspense } from "react";
import RecipeStoreInitializer from "@/components/RecipeStoreInitializer";

async function InitialRecipes() {
	const initialData = await fetchRecipesApi("", 0);

	return (
		<>
			<RecipeStoreInitializer
				initialRecipes={initialData.recipes}
				initialTotal={initialData.total}
			/>
			<RecipeListClient />
		</>
	);
}

export default async function HomePage() {
	return (
		<Suspense
			fallback={<Message message="Loading recipes..." colour="var(--black)" />}
		>
			<InitialRecipes />
		</Suspense>
	);
}
