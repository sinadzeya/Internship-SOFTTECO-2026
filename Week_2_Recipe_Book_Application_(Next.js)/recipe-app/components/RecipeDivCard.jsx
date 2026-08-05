import {cn} from "../utils/cn.js";
import cookingTimeLogo from "../public/images/cooking-time-logo.png"
import cuisineLogo from "../public/images/cuisine-logo.png"
import {TagsDiv} from "./TagsDiv.jsx";
import {ImgNameTagDiv} from "./ImgNameTagDiv.jsx";

export function RecipeDivCard({loading, recipes, filteredRecipes, handleSelectRecipe, className = '', ...props}) {

    const baseStyles = "relative flex flex-col w-full max-w-[33.3rem] md:max-w-[42.0rem] h-full text-[var(--black)] border rounded-[1rem] !pb-[2.0rem]";

    return (
        <ul className={cn(className, "relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch justify-items-center gap-y-[6.7rem] md:gap-x-[4.0rem] md:gap-y-[5.0rem] w-full")}>
            {filteredRecipes.map((recipe) => (
                <li
                    key={recipe.id}
                    className={baseStyles} {...props}
                    onClick={() => handleSelectRecipe(recipe)}
                >
                    <img className="w-full h-[22.0rem] md:h-[26.0rem] object-cover rounded-t-[1rem] border-b" src={recipe.image} alt={recipe.name}></img>

                    <TagsDiv recipe={recipe} className="gap-[1.0rem] !mt-[2.0rem] !mx-[2.0rem]"/>

                    <div className="flex-1 flex flex-col justify-between">

                        <h3 className="!mx-[2rem] !mt-[1rem] md:!mt-[2.4rem] text-center md:text-left text-[4.0rem] text-[var(--black)] font-normal font-justme">{recipe.name}</h3>

                        <div className="flex flex-col !my-[2rem] md:!mb-[4.0rem] gap-[1.6rem]">

                            <ImgNameTagDiv
                                name="Cuisine"
                                logo={cuisineLogo.src}
                                recipe={recipe}
                                recipeName="cuisine"
                                colour="var(--red)"
                                minTagWidth="8.5rem"
                                imgLeftMob="1.7rem"
                                imgLeftDesc="2.0rem"
                                pLeftMob="5.1rem"
                                pLeftDesc="5.4rem"
                            />

                            <ImgNameTagDiv
                                name="Cooking Time"
                                logo={cookingTimeLogo.src}
                                recipe={recipe}
                                recipeName="cookTimeMinutes"
                                colour="var(--blue)"
                                addText="min"
                                minTagWidth="8.5rem"
                                imgLeftMob="1.7rem"
                                imgLeftDesc="2.0rem"
                                pLeftMob="5.1rem"
                                pLeftDesc="5.4rem"
                            />

                        </div>

                    </div>


                    <p className={cn(
                        "w-[7.4rem] h-[3.0rem] !mb-0 !ml-[1.75rem] md:!ml-[2.0rem] text-center text-[1.6rem] border rounded-[1rem] font-normal",
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