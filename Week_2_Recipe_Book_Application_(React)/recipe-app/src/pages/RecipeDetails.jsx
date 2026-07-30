import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchRecipeById} from "../store/recipeSlice.js";
import {MainDivContainer} from "../components/MainDivContainer.jsx";
import {LogoDiv} from "../components/LogoDiv.jsx";
import {NavButton} from "../components/NavButton.jsx";
import {TagsDiv} from "../components/TagsDiv.jsx";
import {ImgNameTagDiv} from "../components/ImgNameTagDiv.jsx";
import cuisineLogo from "../images/cuisine-logo.png";
import cookingTimeLogo from "../images/cooking-time-logo.png";
import servingsLogo from "../images/servings-logo.png";
import levelLogo from "../images/level-logo.png";
import {BulletListInsideBorderDiv} from "../components/BulletListInsideBorderDiv.jsx";
import {ListInsideDiv} from "../components/ListInsideDiv.jsx";

export function RecipeDetails() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {selectedRecipe, selectedRecipeLoading} = useSelector(
        (state) => state.recipes
    );

    useEffect(() => {
        dispatch(fetchRecipeById(id));

    }, [dispatch, id]);

    if (selectedRecipeLoading) return <p>Loading recipe details...</p>;
    if (!selectedRecipe) return <p>Recipe not found</p>;

    return (
        <MainDivContainer>

            <div className="w-full flex items-center !pt-[2.0rem] !pr-[3.0rem] !pl-[2.0rem] !pb-[3.0rem] md:!pt-[4.6rem] md:!pr-[0.0rem] md:!pl-[5.0rem] md:!pb-[4.0rem]">

                <NavButton className="!mr-[1.0rem] md:!mr-[3.3rem]" onClick={() => navigate(-1)}/>

                <LogoDiv title="Recipe Book"/>

            </div>

            <img className="flex justify-center w-[35.3rem] h-[26.6rem] !ml-[2rem] border object-cover" src={selectedRecipe.image} alt={selectedRecipe.name}/>

            <TagsDiv recipe={selectedRecipe} className="gap-[1.0rem] top-[40.4rem] left-[2.0rem]"/>

            <h3 className="w-full text-left !px-[2.0rem] !pt-[7.6rem] text-[4.8rem] text-[var(--black)] font-normal font-justme">{selectedRecipe.name}</h3>

            <ImgNameTagDiv
                className="top-[3rem] "
                name="Level"
                logo={levelLogo}
                recipe={selectedRecipe}
                recipeName="difficulty"
                colour="var(--dark-orange)"
                bgColour="var(--light-orange)"
                tagWidth="8.5rem"
            />

            <ImgNameTagDiv
                className="top-[7.6rem] "
                name="Servings"
                logo={servingsLogo}
                recipe={selectedRecipe}
                recipeName="servings"
                colour="var(--dark-orange)"
                tagWidth="5rem"
            />

            <ImgNameTagDiv
                className="top-[12.2rem] "
                name="Cuisine"
                logo={cuisineLogo}
                recipe={selectedRecipe}
                recipeName="cuisine"
                colour="var(--red)"
                tagWidth="8.5rem"
            />

            <ImgNameTagDiv
                className="top-[16.8rem]"
                name="Cooking Time"
                logo={cookingTimeLogo}
                recipe={selectedRecipe}
                recipeName="cookTimeMinutes"
                colour="var(--blue)"
                addText="min"
                tagWidth="8.5rem"
            />

            <div className="relative top-[25.0rem] !ml-[2.0rem] flex flex-col gap-y-[3.0rem]">
                <BulletListInsideBorderDiv
                    name = "Ingredients"
                    recipe={selectedRecipe}
                    recipeName="ingredients"
                />

                <ListInsideDiv
                    name = "Instructions"
                    recipe={selectedRecipe}
                    recipeName="instructions"
                />

            </div>



        </MainDivContainer>
    );
}