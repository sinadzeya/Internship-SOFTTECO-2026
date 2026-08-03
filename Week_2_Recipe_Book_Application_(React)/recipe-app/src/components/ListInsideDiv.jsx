import {cn} from "../utils/cn.js";
import React from "react";

export function ListInsideDiv({name, recipe, recipeName, className = '', ...props}) {
    const items = recipe[recipeName];

    return (
        <div className={cn("relative max-w-[35.3rem] md:max-w-[66.0rem] mx-auto flex flex-col !pb-[4.0rem]", className)} {...props}>
            <h3 className="w-full text-left !pl-[2.0rem] !pt-[1.6rem] !pb-[1.5rem] md:!pb-[2.5rem] text-[4.0rem] md:text-[6.4rem] text-[var(--black)] font-normal font-justme">{name}</h3>

            {Array.isArray(items) ? (
                <ol className="list-decimal list-outside !pl-[5.0rem] text-[2.0rem] md:text-[2.4rem] text-[var(--black)] font-nunito font-normal">
                    {items.map((item, index) => (
                        <li key={index} className="leading-snug !mb-[1.0rem]">{item}</li>
                    ))}
                </ol>
            ) : (
                <p className="tag text-[2.0rem] md:text-[2.4rem] font-nunito">{items}</p>
            )}

        </div>
    );
}