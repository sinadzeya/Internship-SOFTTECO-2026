import React, {useState, useEffect} from 'react';
import {fetchRecipeById} from '../api/recipeApi.js'
import {useParams, useNavigate} from "react-router-dom";

export function RecipeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchRecipeById(id)
            .then((data) => {
                setRecipe(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Loading recipe details...</p>;
    if (!recipe) return <p>Recipe not found.</p>;

    return (
        <div className="recipe-details">
            <button onClick={() => navigate(-1)}>Go back</button>

            <img src={recipe.image} alt={recipe.name} />

            <div className="tags">
                {Array.isArray(recipe.tags)
                    ? recipe.tags.map((item, index) => <li key={index}>{item}</li>)
                    : <li>{recipe.tags}</li>
                }
            </div>

            <h2>{recipe.name}</h2>

            <div className="metadata">
                <p>Level: {recipe.difficulty}</p>
                <p>Servings: {recipe.servings}</p>
                <p>Cuisine: {recipe.cuisine}</p>
                <p>Cooking Time: {recipe.cookTimeMinutes}</p>
            </div>

            <div className="ingredients">
                <h3>Ingredients</h3>
                <ul>
                    {Array.isArray(recipe.ingredients)
                        ? recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)
                        : <li>{recipe.ingredients}</li>
                    }
                </ul>
            </div>

            <div className="instructions">
                <h3>Instructions</h3>
                <p>{recipe.instructions}</p>
            </div>

        </div>
    );
}