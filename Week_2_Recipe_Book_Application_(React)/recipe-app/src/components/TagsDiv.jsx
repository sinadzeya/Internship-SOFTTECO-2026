import React from "react";
import {cn} from "../utils/cn.js";

export function TagsDiv({recipe, className = '', ...props}) {
    return (
        <div className={cn("absolute grid grid-cols-3", className)} {...props}>
            {Array.isArray(recipe.tags)
                ? recipe.tags.map((item, index) => <div
                    className="w-[8.5rem] h-[2.6rem] text-center text-[var(--dark-orange)] text-[1.6rem] font-nunito border rounded-[1rem] font-normal"
                    key={index}>{item}
                </div>)
                : <div>{recipe.tags}</div>
            }
        </div>
    );
}