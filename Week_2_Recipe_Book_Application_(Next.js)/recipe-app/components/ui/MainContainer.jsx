import {cn} from "@/utils/cn.js";

export function MainContainer({children, className = '', ...props}) {

    const baseStyles = "w-full flex flex-col items-start";

    return (
        <div
            className={cn(baseStyles, className)}
            {...props}
        >
            {children}
        </div>
    );
}