"use client";

import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setInitialRecipes } from "@/store/recipeSlice";

export default function RecipeStoreInitializer({
	initialRecipes,
	initialTotal,
}) {
	const initialized = useRef(false);
	const dispatch = useDispatch();

	if (!initialized.current) {
		dispatch(
			setInitialRecipes({ recipes: initialRecipes, total: initialTotal }),
		);
		initialized.current = true;
	}

	return null;
}
