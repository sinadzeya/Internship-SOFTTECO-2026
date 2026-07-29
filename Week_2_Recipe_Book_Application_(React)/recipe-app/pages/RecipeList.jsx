import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {setFilter, setKeyword, incrementPage, fetchRecipes, Difficulty} from '../src/store/recipeSlice.js';
import {SearchInput} from "../src/components/SearchInput.jsx";
import {MainDivContainer} from "../src/components/MainDivContainer.jsx";
import {TopDivImage} from "../src/components/TopDivImage.jsx";
import {FilterButtons} from "../src/components/FilterButtons.jsx";
import {RecipeDivCard} from "../src/components/RecipeDivCard.jsx";


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
        <MainDivContainer className="gap-[4.0rem]">

            <TopDivImage title="Recipe Book"/>

            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-[4.0rem]">

                <SearchInput className="md:!ml-[5.5rem]" value={keyword} onChange={handleSearchChange} />

                <FilterButtons
                    className="md:!mr-[5.5rem]"
                    filter={filter}
                    onFilterChange={(level) => dispatch(setFilter(level))}
                />

            </div>


            <RecipeDivCard
                className="md:!px-[5.0rem]"
                loading={loading}
                recipes={recipes}
                filteredRecipes={filteredRecipes}
                handleSelectRecipe={handleSelectRecipe}
            />


            <button
                type="button"
                onClick={handleLoadMore}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Load more'}
            </button>
        </MainDivContainer>
    );
}

