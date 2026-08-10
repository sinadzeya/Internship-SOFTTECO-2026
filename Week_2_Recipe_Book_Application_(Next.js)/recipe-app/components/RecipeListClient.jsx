'use client';

import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from "react";

import {Difficulty, fetchRecipes, incrementPage, setFilter, setKeyword} from "@/store/recipeSlice";
import {MainContainer, TopImage, SearchInput, FilterButtons, Message, RecipeCard, LoadButton} from "@/components/ui";


export default function RecipeList() {
    const dispatch = useDispatch();

    const {filter, keyword, recipes, loading, currentPage} = useSelector(
        (state) => state.recipes
    );

    const handleSearchChange = (e) => {
        dispatch(setKeyword(e.target.value));
    };

    const handleLoadMore = () => {
        dispatch(incrementPage());
    };

    useEffect(() => {
        if (currentPage > 0 || keyword !== '') {
            dispatch(fetchRecipes());
        }
    }, [dispatch, keyword, currentPage]);

    const filteredRecipes = recipes.filter((recipe) => {
        if (filter === Difficulty.All) return true;
        return recipe.difficulty === filter;
    });

    return (
        <MainContainer className="gap-[4.0rem]">

            <TopImage title="Recipe Book"/>

            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-[4.0rem]">

                <SearchInput className="md:mt-[2.0rem] md:ml-[5.5rem]" value={keyword} onChange={handleSearchChange}/>

                <FilterButtons
                    className="md:mr-[5.5rem]"
                    filter={filter}
                    onFilterChange={(level) => dispatch(setFilter(level))}
                />

            </div>

            {loading && recipes.length === 0 ? (
                <MessageDiv
                    message="Loading recipes..."
                    colour="var(--black)"
                />
            ) : loading && filteredRecipes.length === 0 ? (
                <MessageDiv
                    message="No recipes found for the selected filter"
                    colour="var(--red)"
                />
            ) : (
                <RecipeCard
                    className="md:pt-[2.0rem] md:px-[5.0rem]"
                    loading={loading}
                    recipes={recipes}
                    filteredRecipes={filteredRecipes}
                />
            )}

            <LoadButton
                className="pb-[5.0rem] md:pb-[10.0rem] pt-[5.0rem]"
                loading={loading}
                handleLoadMore={handleLoadMore}
            />

        </MainContainer>
    );
}