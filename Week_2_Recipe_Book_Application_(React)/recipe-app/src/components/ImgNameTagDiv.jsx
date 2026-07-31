import React from "react";
import {cn} from "../utils/cn.js";

export function ImgNameTagDiv({name, logo, recipe, recipeName, colour, tagWidth, bgColour='', addText='', className = '', ...props }) {
    return (
        <div className={cn("relative w-full flex flex-row", className)} {...props}>
            <img className="absolute w-[3.0rem] h-[3.0rem] left-[1.7rem] md:left-[0rem]" src={logo} alt={`${name} logo`}></img>
            <p className="absolute left-[5.8rem] md:left-[3.8rem] text-[2.0rem] text-[var(--black)] font-normal font-nunito">{name}</p>
            <div style={{ color: colour, background: bgColour, width: tagWidth}} className="absolute right-[1.8rem] md:right-[2.0rem] h-[2.6rem] text-center text-[1.6rem] font-nunito border rounded-[1rem] font-normal">{recipe[recipeName]} {addText}</div>
        </div>
    );
}