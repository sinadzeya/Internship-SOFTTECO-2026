import {cn} from "@/utils/cn.js";

export function ImgNameTag({
                                  name, logo, recipe, recipeName, colour, minTagWidth,
                                  imgLeftMob = "1.7rem",
                                  imgLeftDesc = "2.0rem",
                                  pLeftMob = "5.8rem",
                                  pLeftDesc = "5.8rem", bgColour = '', addText = '', className = '', ...props
                              }) {
    return (
        <div className={cn("relative w-full h-[3.0rem] flex flex-row", className)} {...props}>
            <img style={{"--img-left-mob": imgLeftMob, "--img-left-desc": imgLeftDesc}}
                 className="absolute w-[3.0rem] h-[3.0rem] left-[var(--img-left-mob)] md:left-[var(--img-left-desc)]"
                 src={logo} alt={`${name} logo`}></img>
            <p style={{"--p-left-mob": pLeftMob, "--p-left-desc": pLeftDesc}}
               className="absolute left-[var(--p-left-mob)] md:left-[var(--p-left-desc)] text-[2.0rem] text-[var(--black)] font-normal font-nunito">{name}</p>
            <div style={{color: colour, background: bgColour, minWidth: minTagWidth}}
                 className="absolute right-[1.8rem] md:right-[2.0rem] px-[1.0rem] h-[2.6rem] text-center text-[1.6rem] font-nunito border rounded-[1rem] font-normal">{recipe[recipeName]} {addText}</div>
        </div>
    );
}