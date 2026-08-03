import {cn} from '../utils/cn';
import loupe from "../images/loupe-logo.png";

export function SearchInput({value, onChange, className = '', ...props}) {

    const baseStyles = "w-[32rem] h-[4.1rem] border rounded-[1rem] text-[var(--black)] !pl-[5.5rem] !pr-[2.0rem] text-[2.0rem] font-nunito outline-none transition-shadow focus:shadow-[0rem_0rem_1rem_0rem_var(--mid-orange)]";

    return (
        <div className={cn("relative flex items-center self-center md:self-start", className)}>
            <img
                src={loupe}
                alt="A black icon of a loupe"
                className="absolute left-[2.0rem] w-[2.5rem] h-[2.5rem]"
            />
            <input
                type="text"
                value={value}
                onChange={onChange}
                className={baseStyles}
                {...props}
            />
        </div>

    );
}