"use client";

import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { fetchRecipeById } from "@/store/recipeSlice";
import {
	MainContainer,
	Message,
	NavButton,
	Logo,
	Tags,
	ImgNameTag,
	BulletListInsideBorder,
	ListInside,
} from "@/components/ui";

import cuisineLogo from "@/public/images/cuisine-logo.png";
import cookingTimeLogo from "@/public/images/cooking-time-logo.png";
import servingsLogo from "@/public/images/servings-logo.png";
import levelLogo from "@/public/images/level-logo.png";

export default function RecipeDetails() {
	const { id } = useParams();
	const dispatch = useDispatch();

	const { selectedRecipe, selectedRecipeLoading } = useSelector(
		(state) => state.recipes,
	);

	useEffect(() => {
		dispatch(fetchRecipeById(id));
	}, [dispatch, id]);

	if (selectedRecipeLoading)
		return (
			<Message message="Loading recipe details..." colour="var(--black)" />
		);
	if (!selectedRecipe || Object.keys(selectedRecipe).length === 0)
		return <Message message="Recipe not found" colour="var(--red)" />;

	return (
		<MainContainer>
			<div className="relative w-full flex items-center pt-[2.0rem] md:pt-[4.6rem] pb-[3.0rem] md:pb-[4.0rem]">
				<NavButton className="absolute left-[2.0rem] md:left-[5.0rem] z-10 bg-white" />

				<Logo title="Recipe Book" />
			</div>

			<div className="w-full grid grid-cols-1 md:grid-cols-2 items-stretch md:gap-x-[7.5rem] md:px-[5.0rem]">
				<div className="flex flex-col justify-center items-center md:items-start h-full">
					<div className="relative w-full h-full max-w-[35.3rem] md:max-w-[66.0rem] aspect-[35.3/26.6] border overflow-hidden">
						<Image
							fill
							sizes="(min-width: 768px) 66rem, 35.3rem"
							src={selectedRecipe.image}
							alt={selectedRecipe.name}
							className="w-full h-full object-cover"
						/>
					</div>
				</div>

				<div className="flex flex-col md:mt-[4.5rem]">
					<Tags
						recipe={selectedRecipe}
						className="gap-[1.0rem] mt-[4.0rem] md:mt-[0rem] ml-[2.0rem] md:ml-[0rem]"
					/>

					<h3 className="w-full text-left px-[2.0rem] md:px-[0rem] pt-[1.0rem] md:pt-[2.6rem] text-[4.8rem] md:text-[8.0rem] text-[var(--black)] font-normal font-justme">
						{selectedRecipe.name}
					</h3>

					<div className="flex flex-col gap-[1.6rem] mt-[3.0rem] md:mt-[4.0rem] ml-[2.0rem] md:max-w-[40.0rem] md:ml-[0rem]">
						<ImgNameTag
							name="Level"
							logo={levelLogo}
							recipe={selectedRecipe}
							recipeName="difficulty"
							colour="var(--dark-orange)"
							bgColour="var(--light-orange)"
							minTagWidth="8.5rem"
							imgLeftMob="0rem"
							imgLeftDesc="0rem"
							pLeftMob="3.8rem"
							pLeftDesc="3.8rem"
						/>

						<ImgNameTag
							name="Servings"
							logo={servingsLogo}
							recipe={selectedRecipe}
							recipeName="servings"
							colour="var(--dark-orange)"
							minTagWidth="5rem"
							imgLeftMob="0rem"
							imgLeftDesc="0rem"
							pLeftMob="3.8rem"
							pLeftDesc="3.8rem"
						/>

						<ImgNameTag
							name="Cuisine"
							logo={cuisineLogo}
							recipe={selectedRecipe}
							recipeName="cuisine"
							colour="var(--red)"
							minTagWidth="8.5rem"
							imgLeftMob="0rem"
							imgLeftDesc="0rem"
							pLeftMob="3.8rem"
							pLeftDesc="3.8rem"
						/>

						<ImgNameTag
							name="Cooking Time"
							logo={cookingTimeLogo}
							recipe={selectedRecipe}
							recipeName="cookTimeMinutes"
							colour="var(--blue)"
							addText="min"
							minTagWidth="8.5rem"
							imgLeftMob="0rem"
							imgLeftDesc="0rem"
							pLeftMob="3.8rem"
							pLeftDesc="3.8rem"
						/>
					</div>
				</div>
			</div>

			<div className="relative top-[5.2rem] md:top-[8rem] md:mb-[15.5rem] mx-auto md:ml-[5.0rem] grid grid-cols-1 md:grid-cols-2 gap-y-[3.0rem] md:gap-x-[6.0rem] w-full md:w-[calc(100%-10rem)] items-center">
				<div className="flex flex-col order-1 md:order-2 items-center md:items-start px-[2.0rem] md:px-[0rem]">
					<BulletListInsideBorder
						name="Ingredients"
						recipe={selectedRecipe}
						recipeName="ingredients"
					/>
				</div>

				<div className="flex flex-col order-2 md:order-1 items-center md:items-start">
					<ListInside
						name="Instructions"
						recipe={selectedRecipe}
						recipeName="instructions"
					/>
				</div>
			</div>
		</MainContainer>
	);
}
