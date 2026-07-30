import React from "react";
import {cn} from "../utils/cn.js";

export function LoadButton({loading, handleLoadMore, variant = 'default', className = '', ...props }) {

    const baseStyles = "w-[17.9rem] h-[5.6rem] border rounded-[1rem] text-[var(--black)] text-[3.2rem] font-justme font-normal";

    const variants = {
        default: "",
        focus: "shadow-[0rem_0rem_1rem_0rem_var(--mid-orange)]"
    };

    return (
        <div className={cn("w-full flex justify-center", className)}
             {...props}>
            <button
                type="button"
                className={cn(baseStyles, variants[variant])}
                onClick={handleLoadMore}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Load more'}
            </button>
        </div>
    );
}