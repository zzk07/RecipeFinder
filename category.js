


const categoryMap = {
    'breakfast.html': 'breakfast',
    'lunch.html': 'lunch',
    'dinner.html': 'dinner',
    'desserts.html': 'dessert',
    'vegetarian.html': 'vegetarian',
    'quick.html': 'quick',
};

function getCategoryFromPage() {
    const path = window.location.pathname.split('/').pop();
    return categoryMap[path] || 'main course';
}

async function fetchCategoryRecipes(category) {
    const API_KEY = config.API_KEY;
    const API_BASE_URL = config.API_BASE_URL;
    const MAX_RECIPES = config.MAX_RECIPES || 12;
    let params = {
        apiKey: API_KEY,
        number: MAX_RECIPES,
    };

    if (category === 'vegetarian') {
        params.diet = 'vegetarian';
    } else if (category === 'quick') {
        params.maxReadyTime = 20;
    } else {
        params.type = category;
    }
    try {
        showLoading();
        const response = await axios.get(`${API_BASE_URL}/complexSearch`, { params });
        return response.data.results;
    } catch (error) {
        showNotification('Error fetching recipes for this category.', 'error');
        return [];
    } finally {
        hideLoading();
    }
}

function renderCategoryRecipes(recipes) {
    const grid = document.getElementById('categoryRecipeGrid');
    if (!recipes || recipes.length === 0) {
        grid.innerHTML = `<div class="empty-state"><h3>No recipes found for this category.</h3></div>`;
        return;
    }
    grid.innerHTML = recipes.map(recipe => `
        <div class="recipe-card" onclick="showRecipeDetails(${recipe.id})">
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe-info">
                <h3>${recipe.title}</h3>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    const category = getCategoryFromPage();
    const recipes = await fetchCategoryRecipes(category);
    renderCategoryRecipes(recipes);
}); 