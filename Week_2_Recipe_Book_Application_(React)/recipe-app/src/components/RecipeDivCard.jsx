import {cn} from "../utils/cn.js";
import React from "react";
import cookingTimeLogo from "../images/cooking-time-logo.png"
import cuisineLogo from "../images/cuisine-logo.png"

export function RecipeDivCard({loading, recipes, filteredRecipes, handleSelectRecipe, className = '', ...props}) {

    const baseStyles = "relative w-full max-w-[33.3rem] h-[51.2rem] md:max-w-[42.0rem] md:h-[58.5rem] text-[var(--black)] border rounded-[1rem]";


    return loading && recipes.length === 0 ? (
        <p>Loading recipes...</p>
    ) : (
        <ul className={cn(className, "relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-y-[6.7rem] md:gap-x-[4.0rem] md:gap-y-[5.0rem] w-full")}>
            {filteredRecipes.map((recipe) => (
                <li
                    key={recipe.id}
                    className={baseStyles} {...props}
                    onClick={() => handleSelectRecipe(recipe)}
                >
                    <img className="w-full h-[22.0rem] object-cover rounded-t-[1rem] border-b" src={recipe.image} alt={recipe.name}></img>

                    <div className="absolute grid grid-cols-3 gap-[1.0rem] top-[24.0rem] left-[2.0rem]">
                        {Array.isArray(recipe.tags)
                            ? recipe.tags.map((item, index) => <div
                                className="w-[8.5rem] h-[2.6rem] top-[25.0rem] text-center text-[var(--dark-orange)] text-[1.6rem] font-nunito border rounded-[1rem] font-normal"
                                key={index}>{item}
                            </div>)
                            : <div>{recipe.tags}</div>
                        }
                    </div>

                    <h3 className="absolute w-full text-center md:text-left md:left-[2.0rem] top-[27.6rem] text-[4.0rem] text-[var(--black)] font-normal font-justme">{recipe.name}</h3>

                    <div className="relative w-full flex flex-row top-[13.6rem]">
                        <img className="absolute w-[3.0rem] h-[3.0rem] left-[1.7rem]" src={cuisineLogo} alt="Black line icon featuring a chef's hat above a crossed knife and spatula"></img>
                        <p className="absolute left-[4.85rem] text-[2.0rem] text-[var(--black)] font-normal font-nunito">Cuisine</p>
                        <div className="absolute right-[1.8rem] w-[8.5rem] h-[2.6rem] text-center text-[var(--red)] text-[1.6rem] font-nunito border rounded-[1rem] font-normal">{recipe.cuisine}</div>
                    </div>

                    <div className="relative w-full flex flex-row top-[18.6rem]">
                        <img className="absolute w-[3.0rem] h-[3.0rem] left-[1.7rem]" src={cookingTimeLogo} alt="Black line icon of a timer with clock hands shaped like a fork and spoon"></img>
                        <p className="absolute left-[4.85rem] text-[2.0rem] text-[var(--black)] font-normal font-nunito">Cooking Time</p>
                        <div className="absolute right-[1.8rem] w-[8.5rem] h-[2.6rem] text-center text-[var(--blue)] text-[1.6rem] font-nunito border rounded-[1rem] font-normal">{recipe.cookTimeMinutes} min</div>
                    </div>

                    <p className={cn(
                        "absolute w-[7.4rem] h-[3.0rem] bottom-[2.0rem] left-[1.75rem] text-center text-[1.6rem] border rounded-[1rem] font-normal",
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