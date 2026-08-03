import React from "react";
import {cn} from "../utils/cn.js";

export function LoadButton({loading, handleLoadMore, className = '', ...props }) {

    const baseStyles = "w-[17.9rem] h-[5.6rem] border rounded-[1rem] text-[var(--black)] text-[3.2rem] font-justme font-normal outline-none transition-all hover:shadow-[0rem_0rem_1rem_0rem_var(--mid-orange)] disabled:opacity-50 disabled:cursor-not-allowed"

    return (
        <div className={cn("w-full flex justify-center", className)}
             {...props}>
            <button
                type="button"
                className={baseStyles}
                onClick={handleLoadMore}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Load more'}
            </button>
        </div>
    );
}