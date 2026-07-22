import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RecipeList } from './components/RecipeList.jsx';
import { RecipeDetails } from './components/RecipeDetails.jsx';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <h1>Recipe Book</h1>

            <Routes>
                <Route path="/" element={<RecipeList />} />
                <Route path="/recipes/:id" element={<RecipeDetails />} />
            </Routes>
        </div>
    );
}

export default App;
