import React from "react";
import {cn} from "../utils/cn.js";

export function BulletListInsideBorderDiv({name, recipe, recipeName, className = '', ...props }) {
    const items = recipe[recipeName];

    return (
        <div className={cn("relative w-[35.3rem] flex flex-col border rounded-[1rem] !pb-[4.0rem]", className)} {...props}>
            <h3 className="w-full text-left !pl-[2.0rem] !pt-[1.6rem] !pb-[1.5rem] text-[4.0rem] text-[var(--black)] font-normal font-justme">{name}</h3>

            {Array.isArray(items) ? (
                <ul className="list-disc list-inside !pl-[2.0rem] text-[2.0rem] text-[var(--black)] font-nunito font-semibold">
                    {items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            ) : (
                <p className="tag text-[2.0rem] font-nunito">{items}</p>
            )}

        </div>
    );
}