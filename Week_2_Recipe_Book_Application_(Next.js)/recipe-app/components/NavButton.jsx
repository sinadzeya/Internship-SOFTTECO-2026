import {cn} from "../utils/cn.js";

export function NavButton({onClick, className = '', ...props }) {

    const baseStyles = "w-[12.0rem] h-[4.8rem] font-normal font-justme text-center text-[3.2rem] border rounded-[1rem]"

    return (
        <div className={cn("shrink-0 flex", className)}
             {...props}>
            <button
                type="button"
                className={cn(baseStyles)}
                onClick={onClick}
            >
                Go back
            </button>
        </div>
    );
}