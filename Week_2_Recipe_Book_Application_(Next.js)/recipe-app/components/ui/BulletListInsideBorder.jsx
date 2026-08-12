import { cn } from "@/utils/cn.js";

export function BulletListInsideBorder({
	name,
	recipe,
	recipeName,
	className = "",
	...props
}) {
	const items = recipe[recipeName];

	return (
		<div
			className={cn(
				"relative flex flex-col border rounded-[1rem] pb-[4.0rem] w-full",
				className,
			)}
			{...props}
		>
			<h3 className="w-full text-left pl-[2.0rem] md:pl-[4.0rem] pt-[1.6rem] pb-[1.5rem] md:pb-[2.5rem] text-[4.0rem] md:text-[6.4rem] text-[var(--black)] font-normal font-justme">
				{name}
			</h3>

			<div className="w-full">
				{Array.isArray(items) ? (
					<ul className="list-disc list-inside pl-[2.0rem] md:pl-[4.0rem] text-[2.0rem] md:text-[2.4rem] text-[var(--black)] font-nunito font-medium">
						{items.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				) : (
					<p className="tag text-[2.0rem] md:text-[2.4rem] font-nunito">
						{items}
					</p>
				)}
			</div>
		</div>
	);
}
