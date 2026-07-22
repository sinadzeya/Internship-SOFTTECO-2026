import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {fetchRecipes} from '../api/recipeApi.js'

const Difficulty = {
    All: 'All',
    Easy: 'Easy',
    Medium: 'Medium',
    Hard: 'Hard'
};

export function RecipeList({initialKeyword = ''}) {
    const [filter, setFilter] = useState(Difficulty.All);
    const [keyword, setKeyword] = useState(initialKeyword);
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
        setCurrentPage(0);
        setRecipes([]);
    };

    const handleSelectRecipe = (recipe) => {
        setSelectedRecipe(recipe);
        navigate(`/recipes/${recipe.id}`);
    };

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        fetchRecipes(keyword, currentPage).then((newRecipes) => {
            if (isMounted) {
                setRecipes((prevRecipes) =>
                    currentPage === 0 ? newRecipes : [...prevRecipes, ...newRecipes]
                );
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [keyword, currentPage]);

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
                        onClick={() => setFilter(level)}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {loading ? (
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
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Load more'}
            </button>
        </div>
    );

}

