import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {setFilter, setKeyword, incrementPage, fetchRecipes, Difficulty} from '../store/recipeSlice.js';


export function RecipeList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {filter, keyword, recipes, loading, currentPage} = useSelector(
        (state) => state.recipes
    );

    const handleSearchChange = (e) => {
        dispatch(setKeyword(e.target.value));
    };

    const handleSelectRecipe = (recipe) => {
        navigate(`/recipes/${recipe.id}`);
    };

    const handleLoadMore = () => {
        dispatch(incrementPage());
    };

    useEffect(() => {
        dispatch(fetchRecipes());
    }, [dispatch, keyword, currentPage]);

    const filteredRecipes = recipes.filter((recipe) => {
        if (filter === Difficulty.All) return true;
        return recipe.difficulty === filter;
    });

    return (
        <div>

            <input
                type="text"
                value={keyword}
                onChange={handleSearchChange}
            />

            <div className="filter-buttons">
                {Object.values(Difficulty).map((level) => (
                    <button
                        key={level}
                        className={filter === level ? 'active' : ''}
                        onClick={() => dispatch(setFilter(level))}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {loading && recipes.length === 0 ? (
                <p>Loading recipes...</p>
            ) : (
                <ul>
                    {filteredRecipes.map((recipe) => (
                        <li
                            key={recipe.id}
                            onClick={() => handleSelectRecipe(recipe)}
                        >
                            <h3>{recipe.name}</h3>
                            <p>Difficulty: {recipe.difficulty}</p>
                        </li>
                    ))}
                </ul>
            )}

            <button
                type="button"
                onClick={handleLoadMore}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Load more'}
            </button>
        </div>
    );
}

