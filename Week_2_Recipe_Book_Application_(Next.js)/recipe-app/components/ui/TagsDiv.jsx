import {cn} from "@/utils/cn.js";

export function TagsDiv({recipe, className = '', ...props}) {
    return (
        <div className={cn("flex flex-wrap", className)} {...props}>
            {Array.isArray(recipe.tags)
                ? recipe.tags.map((item, index) => <div
                    className="min-w-[8.5rem] w-auto h-[2.6rem] px-[1.0rem] text-center text-[var(--dark-orange)] text-[1.6rem] font-nunito border rounded-[1rem] font-normal"
                    key={index}>{item}
                </div>)
                : <div>{recipe.tags}</div>
            }
        </div>
    );
}