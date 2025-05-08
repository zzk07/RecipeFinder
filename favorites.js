const favoritesGrid = document.getElementById('favoritesGrid');
const emptyFavorites = document.getElementById('emptyFavorites');
const sortFavorites = document.getElementById('sortFavorites');

let favoriteRecipes = [];

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();
    fetchFavoriteRecipes(favorites);
}

function showEmptyState() {
    emptyFavorites.style.display = 'flex';
    favoritesGrid.style.display = 'none';
}

function hideEmptyState() {
    emptyFavorites.style.display = 'none';
    favoritesGrid.style.display = 'grid';
}

async function fetchFavoriteRecipes(favoriteIds) {
    try {
        showLoading();
        const recipes = await Promise.all(
            favoriteIds.map(id => 
                axios.get(`${API_BASE_URL}/${id}/information`, {
                    params: { apiKey: API_KEY }
                })
            )
        );
        
        favoriteRecipes = recipes.map(response => response.data);
        displayFavorites();
    } catch (error) {
        showNotification('Error loading favorite recipes', 'error');
        console.error('Error:', error);
    } finally {
        hideLoading();
    }
}

function displayFavorites() {
    const sortedRecipes = sortRecipes(favoriteRecipes, sortFavorites.value);
    
    favoritesGrid.innerHTML = sortedRecipes.map(recipe => `
        <div class="recipe-card" onclick="showRecipeDetails(${recipe.id})">
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe-info">
                <h3>${recipe.title}</h3>
                <div class="recipe-meta">
                    <span><i class="far fa-clock"></i> ${recipe.readyInMinutes} mins</span>
                    <span><i class="fas fa-signal"></i> ${recipe.difficulty || 'Medium'}</span>
                </div>
                <button class="remove-favorite" onclick="removeFromFavorites(${recipe.id}, event)">
                    <i class="fas fa-heart"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
}

function sortRecipes(recipes, sortBy) {
    return [...recipes].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.title.localeCompare(b.title);
            case 'time':
                return a.readyInMinutes - b.readyInMinutes;
            default:
                return 0;
        }
    });
}

function removeFromFavorites(recipeId, event) {
    event.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = favorites.filter(id => id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    favoriteRecipes = favoriteRecipes.filter(recipe => recipe.id !== recipeId);
    
    if (favoriteRecipes.length === 0) {
        showEmptyState();
    } else {
        displayFavorites();
    }
    
    showNotification('Recipe removed from favorites', 'success');
}

sortFavorites.addEventListener('change', () => {
    displayFavorites();
});

document.addEventListener('DOMContentLoaded', loadFavorites); 