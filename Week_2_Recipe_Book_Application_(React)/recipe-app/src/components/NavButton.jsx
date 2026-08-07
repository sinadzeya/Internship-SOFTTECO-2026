import {cn} from "../utils/cn.js";
import React from "react";
import {Link} from "react-router-dom";

export function NavButton({className = '', ...props }) {

    const baseStyles = "w-[12.0rem] h-[4.8rem] font-normal font-justme text-center text-[3.2rem] border rounded-[1rem]"

    return (
        <div className={cn("shrink-0 flex", className)}>
            <Link
                className={cn(baseStyles)}
                to={`/recipes`}
                {...props}
            >
                Go back
            </Link>
        </div>
    );
}