export function Message({ message, colour, ...props }) {
	return (
		<div
			style={{ color: colour }}
			className="w-full flex justify-center font-normal text-center font-justme text-[4rem] pt-[5rem]"
			{...props}
		>
			{message}
		</div>
	);
}
