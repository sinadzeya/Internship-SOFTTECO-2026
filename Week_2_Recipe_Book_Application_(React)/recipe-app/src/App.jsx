import React from "react";
import { Routes, Route } from "react-router-dom";
import { RecipeList } from "./pages/RecipeList.jsx";
import { RecipeDetails } from "./pages/RecipeDetails.jsx";
import "./App.css";

function App() {
	return (
		<div className="app-container">
			<Routes>
				<Route path="/" element={<RecipeList />} />
				<Route path="/recipes" element={<RecipeList />} />
				<Route path="/recipes/:id" element={<RecipeDetails />} />
			</Routes>
		</div>
	);
}

export default App;
