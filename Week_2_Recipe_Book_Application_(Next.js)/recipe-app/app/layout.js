import "./globals.css";
import Providers from "@/app/providers";

export const metadata = {
	title: "Recipe Finder",
	description: "Search and browse delicious recipes",
};

export default async function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
