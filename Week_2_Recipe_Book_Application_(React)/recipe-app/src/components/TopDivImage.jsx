import {cn} from "../utils/cn.js";
import mainImage from "../images/main-image.png";
import logo from "../images/logo.svg";

export function TopDivImage({title, className = '', ...props}) {

    const baseStyles = "w-full h-[16.0rem] md:h-[33.6rem] flex items-center justify-center bg-cover bg-center border border-black";

    return (
        <div
            className={cn(baseStyles, className)}
            style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${mainImage})`}}
            {...props}
        >
            <div className="w-full flex items-center gap-[2.9rem] md:gap-[2.55rem]">

                <div className="flex-1 h-[0.3rem] bg-[var(--white)] rounded-r-lg"/>

                <div className="shrink-0 flex items-center gap-[1.0rem]">
                    <img
                        src={logo}
                        alt="A white hand-drawn style icon of a bowl with a spoon and a whisk inside"
                    />
                    <h1 className="text-[var(--white)] text-[4.8rem] md:text-[9.6rem] font-justme font-normal">
                        {title}
                    </h1>
                </div>

                <div className="flex-1 h-[0.3rem] bg-[var(--white)] rounded-l-lg"/>

            </div>

        </div>
    );
}