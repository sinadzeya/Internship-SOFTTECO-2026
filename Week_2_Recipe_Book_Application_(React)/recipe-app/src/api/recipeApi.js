const baseUrl = 'https://dummyjson.com/recipes'

// Fetch recipes by keyword
export const fetchRecipes = async (searchKeyword = '', currentPage = 0, limit = 6) => {
    try {
        const skip = currentPage * limit;
        const endpoint = searchKeyword.trim() ? `${baseUrl}/search` : baseUrl;

        const params = new URLSearchParams({
            limit: limit.toString(),
            skip: skip.toString()
        });

        if (searchKeyword.trim()) {
            params.append('q', searchKeyword.trim());
        }

        const response = await fetch(`${endpoint}?${params.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        return data.recipes || [];

    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
};

// Fetch recipes by tag
export const getRecipesByTag = async (tag) => {
    try {
        const response = await fetch(`${baseUrl}/tag/${encodeURIComponent(tag)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
};

