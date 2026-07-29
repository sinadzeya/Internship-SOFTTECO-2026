import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchRecipeById} from "../src/store/recipeSlice.js";

export function RecipeDetails() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {selectedRecipe, selectedRecipeLoading} = useSelector(
        (state) => state.recipes
    );

    useEffect(() => {
        dispatch(fetchRecipeById(id));

    }, [dispatch, id]);

    if (selectedRecipeLoading) return <p>Loading recipe details...</p>;
    if (!selectedRecipe) return <p>Recipe not found</p>;

    return (
        <div className="recipe-details">
            <button onClick={() => navigate(-1)}>Go back</button>

            <img src={selectedRecipe.image} alt={selectedRecipe.name}/>

            <div className="tags">
                {Array.isArray(selectedRecipe.tags)
                    ? selectedRecipe.tags.map((item, index) => <li key={index}>{item}</li>)
                    : <li>{selectedRecipe.tags}</li>
                }
            </div>

            <h2>{selectedRecipe.name}</h2>

            <div className="metadata">
                <p>Level: {selectedRecipe.difficulty}</p>
                <p>Servings: {selectedRecipe.servings}</p>
                <p>Cuisine: {selectedRecipe.cuisine}</p>
                <p>Cooking Time: {selectedRecipe.cookTimeMinutes}</p>
            </div>

            <div className="ingredients">
                <h3>Ingredients</h3>
                <div className="tags">
                    {Array.isArray(selectedRecipe.tags)
                        ? selectedRecipe.tags.map((item, index) => <span key={index} className="tag">{item}</span>)
                        : <span className="tag">{selectedRecipe.tags}</span>
                    }
                </div>
            </div>

            <div className="instructions">
                <h3>Instructions</h3>
                <p>{selectedRecipe.instructions}</p>
            </div>

        </div>
    );
}