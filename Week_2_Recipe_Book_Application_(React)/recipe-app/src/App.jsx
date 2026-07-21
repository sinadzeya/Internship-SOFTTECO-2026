import React from 'react';
import { RecipeList } from './components/RecipeList.jsx';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <h1>Recipe Book</h1>
            <RecipeList />
        </div>
    );
}

export default App;
