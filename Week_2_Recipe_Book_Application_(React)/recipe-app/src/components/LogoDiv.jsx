import {cn} from "../utils/cn.js";
import logoBlack from "../images/logo-black.svg";
import React from "react";

export function LogoDiv({title, className = '', ...props }) {

    return (
        <div
            className={cn("w-full flex items-center justify-center", className)}
            {...props}
        >

                <div className="flex-1 flex items-center">
                    <div className="h-[0.2rem] bg-[var(--black)] rounded-lg ml-[15.0rem] md:ml-[20.3rem] w-[calc(100%-15.0rem)] md:w-[calc(100%-20.3rem)]"/>
                </div>

                <div className="shrink-0 flex items-center">
                    <img
                        className="w-[4.0rem] h-[4.634rem] ml-[2.0rem] mr-[2.0rem] md:w-[8.0rem] md:h-[8.0rem] md:mr-[0rem]"
                        src={logoBlack}
                        alt="A black hand-drawn style icon of a bowl with a spoon and a whisk inside"
                    />
                    <h1 className="hidden md:block mr-[2.0rem] text-[var(--black)] text-[4.0rem] font-justme font-normal">
                        {title}
                    </h1>
                </div>

                <div className="hidden md:block flex-1 h-[0.2rem] bg-[var(--black)] rounded-l-lg"/>

        </div>
    );

}