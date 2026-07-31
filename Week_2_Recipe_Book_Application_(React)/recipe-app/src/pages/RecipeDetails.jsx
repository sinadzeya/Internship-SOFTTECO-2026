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
import {MessageDiv} from "../components/MessageDiv.jsx";

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

    if (selectedRecipeLoading) return <MessageDiv message="Loading recipe details..." colour="var(--black)"/>
    if (!selectedRecipe) return <MessageDiv message="Recipe not found" colour="var(--red)"/>

    return (
        <MainDivContainer>

            <div
                className="w-full flex items-center !pt-[2.0rem] !pr-[3.0rem] !pl-[2.0rem] !pb-[3.0rem] md:!pt-[4.6rem] md:!pr-[0.0rem] md:!pl-[5.0rem] md:!pb-[4.0rem]">

                <NavButton className="!mr-[1.0rem] md:!mr-[3.3rem]" onClick={() => navigate(-1)}/>

                <LogoDiv title="Recipe Book"/>

            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 items-start">

                <div className="flex flex-col justify-center md:justify-start">

                    <img
                        className="w-[35.3rem] h-[26.6rem] md:w-[66.0rem] md:h-[46.0rem] !ml-[2rem] md:!ml-[5rem] border object-cover"
                        src={selectedRecipe.image} alt={selectedRecipe.name}/>

                </div>

                <div className="md:relative flex flex-col md:!ml-[7.5rem] md:!mt-[4.5rem] md:!mr-[5rem]">

                    <TagsDiv recipe={selectedRecipe}
                             className="gap-[1.0rem] top-[40.4rem] md:top-[0rem] left-[2.0rem] md:left-[0rem]"/>

                    <h3 className="w-full text-left !px-[2.0rem] md:!px-[0rem] !pt-[7.6rem] md:!pt-[2.6rem] text-[4.8rem] md:text-[8.0rem] text-[var(--black)] font-normal font-justme">{selectedRecipe.name}</h3>

                    <div className="md:!mr-[19.5rem]">

                        <ImgNameTagDiv
                            className="top-[3rem] md:top-[4rem]"
                            name="Level"
                            logo={levelLogo}
                            recipe={selectedRecipe}
                            recipeName="difficulty"
                            colour="var(--dark-orange)"
                            bgColour="var(--light-orange)"
                            tagWidth="8.5rem"
                        />

                        <ImgNameTagDiv
                            className="top-[7.6rem] md:top-[8.6rem]"
                            name="Servings"
                            logo={servingsLogo}
                            recipe={selectedRecipe}
                            recipeName="servings"
                            colour="var(--dark-orange)"
                            tagWidth="5rem"
                        />

                        <ImgNameTagDiv
                            className="top-[12.2rem] md:top-[13.2rem]"
                            name="Cuisine"
                            logo={cuisineLogo}
                            recipe={selectedRecipe}
                            recipeName="cuisine"
                            colour="var(--red)"
                            tagWidth="8.5rem"
                        />

                        <ImgNameTagDiv
                            className="top-[16.8rem] md:top-[17.8rem]"
                            name="Cooking Time"
                            logo={cookingTimeLogo}
                            recipe={selectedRecipe}
                            recipeName="cookTimeMinutes"
                            colour="var(--blue)"
                            addText="min"
                            tagWidth="8.5rem"
                        />

                    </div>

                </div>

            </div>


            <div
                className="relative top-[25.0rem] md:top-[8rem] !ml-[2.0rem] md:!ml-[5.0rem] grid grid-cols-1 md:grid-cols-2 gap-y-[3.0rem] md:gap-x-[6.0rem]">

                <div className="flex flex-col order-1 md:order-2">
                    <BulletListInsideBorderDiv
                        name="Ingredients"
                        recipe={selectedRecipe}
                        recipeName="ingredients"
                    />
                </div>

                <div className="flex flex-col order-2 md:order-1">
                    <ListInsideDiv
                        name="Instructions"
                        recipe={selectedRecipe}
                        recipeName="instructions"
                    />
                </div>

            </div>


        </MainDivContainer>
    );
}