import { cn } from "../utils/cn.js";
import { Difficulty } from "../store/recipeSlice.js";
import React from "react";

export function FilterButtons({
	filter,
	onFilterChange,
	className = "",
	...props
}) {
	const baseStyles =
		"w-[10.0rem] h-[3.0rem] md:w-[11.0rem] md:h-[3.5rem] text-[var(--black)] text-[1.6rem] md:text-[2.0rem] font-nunito border rounded-[1rem] font-normal";

	return (
		<div
			className={cn(
				"relative grid grid-cols-3 lg:flex items-center self-center md:self-end gap-[1.0rem]",
				className,
			)}
			{...props}
		>
			{Object.values(Difficulty).map((level) => (
				<button
					key={level}
					className={cn(
						baseStyles,
						filter === level &&
							"text-[var(--blue)] bg-[var(--light-blue)] active",
						level === Difficulty.All && "col-span-3 md:col-span-1",
					)}
					onClick={() => onFilterChange(level)}
				>
					{level}
				</button>
			))}
		</div>
	);
}
