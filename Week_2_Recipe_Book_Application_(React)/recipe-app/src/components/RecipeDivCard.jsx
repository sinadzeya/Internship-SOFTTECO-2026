import {cn} from "../utils/cn.js";
import React from "react";
import cookingTimeLogo from "../images/cooking-time-logo.png"
import cuisineLogo from "../images/cuisine-logo.png"
import {TagsDiv} from "./TagsDiv.jsx";
import {ImgNameTagDiv} from "./ImgNameTagDiv.jsx";

export function RecipeDivCard({loading, recipes, filteredRecipes, handleSelectRecipe, className = '', ...props}) {

    const baseStyles = "relative w-full max-w-[33.3rem] h-[51.2rem] md:max-w-[42.0rem] md:h-[58.5rem] text-[var(--black)] border rounded-[1rem]";


    return (
        <ul className={cn(className, "relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-y-[6.7rem] md:gap-x-[4.0rem] md:gap-y-[5.0rem] w-full")}>
            {filteredRecipes.map((recipe) => (
                <li
                    key={recipe.id}
                    className={baseStyles} {...props}
                    onClick={() => handleSelectRecipe(recipe)}
                >
                    <img className="w-full h-[22.0rem] md:h-[26.0rem] object-cover rounded-t-[1rem] border-b" src={recipe.image} alt={recipe.name}></img>

                    <TagsDiv recipe={recipe} className="gap-[1.0rem] top-[24.0rem] md:top-[28.0rem] left-[2.0rem]"/>

                    <h3 className="absolute w-full text-center md:text-left md:left-[2.0rem] top-[27.6rem] md:top-[32.6rem] text-[4.0rem] text-[var(--black)] font-normal font-justme">{recipe.name}</h3>

                    <ImgNameTagDiv
                        className="top-[13.6rem] md:top-[15.0rem]"
                        name="Cuisine"
                        logo={cuisineLogo}
                        recipe={recipe}
                        recipeName="cuisine"
                        colour="var(--red)"
                        tagWidth="8.5rem"
                    />

                    <ImgNameTagDiv
                        className="top-[18.6rem] md:top-[20.5rem]"
                        name="Cooking Time"
                        logo={cookingTimeLogo}
                        recipe={recipe}
                        recipeName="cookTimeMinutes"
                        colour="var(--blue)"
                        addText="min"
                        tagWidth="8.5rem"
                    />

                    <p className={cn(
                        "absolute w-[7.4rem] h-[3.0rem] bottom-[2.0rem] left-[1.75rem] md:left-[2.0rem] text-center text-[1.6rem] border rounded-[1rem] font-normal",
                        recipe.difficulty === "Easy" && "text-[var(--dark-green)] bg-[var(--light-green)]",
                        recipe.difficulty === "Medium" && "text-[var(--dark-orange)] bg-[var(--light-orange)]",
                        recipe.difficulty === "Hard" && "text-[var(--red)] bg-[var(--light-red)]"
                    )}>
                        {recipe.difficulty}
                    </p>
                </li>
            ))}
        </ul>
    );
}