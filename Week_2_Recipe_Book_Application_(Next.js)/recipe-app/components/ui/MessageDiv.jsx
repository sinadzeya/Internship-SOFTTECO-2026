import {cn} from "@/utils/cn.js";

export function MessageDiv({message, colour, className = '', ...props }) {
    return (
        <div style={{ color: colour}} className={cn("w-full flex justify-center font-normal text-center font-justme text-[4rem] pt-[5rem]", className)} {...props}>
            {message}
        </div>
    );
}