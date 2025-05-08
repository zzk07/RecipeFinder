
const ingredientInput = document.getElementById('ingredientInput');
const addIngredientBtn = document.getElementById('addIngredient');
const selectedIngredients = document.getElementById('selectedIngredients');
const searchRecipesBtn = document.getElementById('searchRecipes');
const recipeGrid = document.getElementById('recipeGrid');
const recipeModal = document.getElementById('recipeModal');
const closeModalBtn = document.querySelector('.close-modal');
const themeToggle = document.querySelector('.theme-toggle');


let ingredients = [];
let recipes = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


const API_KEY = config.API_KEY;
const API_BASE_URL = config.API_BASE_URL;


themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});


const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}


addIngredientBtn.addEventListener('click', () => {
    const ingredient = ingredientInput.value.trim();
    if (ingredient && !ingredients.includes(ingredient)) {
        ingredients.push(ingredient);
        updateIngredientsList();
        ingredientInput.value = '';
        showNotification(`Added ${ingredient} to the list`, 'success');
    }
});

ingredientInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addIngredientBtn.click();
    }
});


function updateIngredientsList() {
    selectedIngredients.innerHTML = ingredients.map(ingredient => `
        <div class="ingredient-tag">
            ${ingredient}
            <button onclick="removeIngredient('${ingredient}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}


function removeIngredient(ingredient) {
    ingredients = ingredients.filter(i => i !== ingredient);
    updateIngredientsList();
    showNotification(`Removed ${ingredient} from the list`, 'info');
}


searchRecipesBtn.addEventListener('click', async () => {
    if (ingredients.length === 0) {
        showNotification('Please add at least one ingredient', 'error');
        return;
    }

    if (API_KEY === 'YOUR_SPOONACULAR_API_KEY') {
        showNotification('Please set up your Spoonacular API key in config.js', 'error');
        return;
    }

    try {
        showLoading();
        const response = await axios.get(`${API_BASE_URL}/findByIngredients`, {
            params: {
                apiKey: API_KEY,
                ingredients: ingredients.join(','),
                number: config.MAX_RECIPES,
                ranking: config.RANKING,
                ignorePantry: true
            }
        });

        if (!response.data || response.data.length === 0) {
            showNotification('No recipes found with these ingredients. Try adding more ingredients.', 'warning');
            return;
        }

        recipes = response.data;
        displayRecipes(recipes);
        showNotification(`Found ${recipes.length} recipes!`, 'success');
    } catch (error) {
        console.error('Error:', error);
        
        if (error.response) {

            switch (error.response.status) {
                case 401:
                    showNotification('Invalid API key. Please check your Spoonacular API key.', 'error');
                    break;
                case 402:
                    showNotification('API quota exceeded. Please try again later.', 'error');
                    break;
                case 429:
                    showNotification('Too many requests. Please try again later.', 'error');
                    break;
                default:
                    showNotification(`Error: ${error.response.data.message || 'Unknown error occurred'}`, 'error');
            }
        } else if (error.request) {
       
            showNotification('No response from server. Please check your internet connection.', 'error');
        } else {

            showNotification('Error setting up the request. Please try again.', 'error');
        }
    } finally {
        hideLoading();
    }
});


function displayRecipes(recipes) {
    recipeGrid.innerHTML = recipes.map(recipe => `
        <div class="recipe-card" onclick="showRecipeDetails(${recipe.id})">
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe-info">
                <h3>${recipe.title}</h3>
                <div class="recipe-meta">
                    <span><i class="far fa-clock"></i> ${recipe.readyInMinutes || 'N/A'} mins</span>
                    <span><i class="fas fa-signal"></i> ${recipe.difficulty || 'Medium'}</span>
                </div>
                <div class="recipe-match">
                    <span>Matches: ${recipe.usedIngredientCount}/${recipe.usedIngredientCount + recipe.missedIngredientCount}</span>
                </div>
            </div>
        </div>
    `).join('');
}


async function showRecipeDetails(recipeId) {
    try {
        showLoading();
        const response = await axios.get(`${API_BASE_URL}/${recipeId}/information`, {
            params: {
                apiKey: API_KEY
            }
        });

        const recipe = response.data;
        const modal = document.getElementById('recipeModal');
        
        document.getElementById('modalRecipeTitle').textContent = recipe.title;
        document.getElementById('modalRecipeTime').textContent = `${recipe.readyInMinutes} mins`;
        document.getElementById('modalRecipeDifficulty').textContent = recipe.difficulty || 'Medium';
        document.getElementById('modalRecipeServings').textContent = `${recipe.servings} servings`;
        document.getElementById('modalRecipeImage').src = recipe.image;
        
        document.getElementById('modalIngredients').innerHTML = recipe.extendedIngredients
            .map(ingredient => `<li>${ingredient.original}</li>`)
            .join('');
        
        document.getElementById('modalInstructions').innerHTML = recipe.analyzedInstructions[0]?.steps
            .map(step => `<li>${step.step}</li>`)
            .join('') || '<li>No instructions available</li>';


        const favoriteBtn = document.querySelector('.favorite-btn');
        const isFavorite = favorites.includes(recipeId);
        favoriteBtn.innerHTML = isFavorite ? 
            '<i class="fas fa-heart"></i> Remove from Favorites' : 
            '<i class="far fa-heart"></i> Add to Favorites';
        favoriteBtn.onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(recipeId);
        };

        modal.style.display = 'block';
    } catch (error) {
        showNotification('Error fetching recipe details', 'error');
        console.error('Error:', error);
    } finally {
        hideLoading();
    }
}


closeModalBtn.addEventListener('click', () => {
    recipeModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === recipeModal) {
        recipeModal.style.display = 'none';
    }
});


document.getElementById('dietFilter').addEventListener('change', filterRecipes);
document.getElementById('timeFilter').addEventListener('change', filterRecipes);
document.getElementById('difficultyFilter').addEventListener('change', filterRecipes);

function filterRecipes() {
    const diet = document.getElementById('dietFilter').value;
    const time = document.getElementById('timeFilter').value;
    const difficulty = document.getElementById('difficultyFilter').value;

    const filteredRecipes = recipes.filter(recipe => {
        const matchesDiet = !diet || recipe.diets?.includes(diet);
        const matchesTime = !time || recipe.readyInMinutes <= parseInt(time);
        const matchesDifficulty = !difficulty || recipe.difficulty === difficulty;
        return matchesDiet && matchesTime && matchesDifficulty;
    });

    displayRecipes(filteredRecipes);
    
    if (filteredRecipes.length === 0) {
        showNotification('No recipes match your filters. Try adjusting them.', 'warning');
    }
}


function toggleFavorite(recipeId) {
    const index = favorites.indexOf(recipeId);
    if (index === -1) {
        favorites.push(recipeId);
        showNotification('Recipe added to favorites', 'success');
    } else {
        favorites.splice(index, 1);
        showNotification('Recipe removed from favorites', 'success');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton(recipeId);
}


function updateFavoriteButton(recipeId) {
    const isFavorite = favorites.includes(recipeId);
    const favoriteBtn = document.querySelector('.favorite-btn');
    favoriteBtn.innerHTML = isFavorite ? 
        '<i class="fas fa-heart"></i> Remove from Favorites' : 
        '<i class="far fa-heart"></i> Add to Favorites';
}


function shareRecipe(recipe) {
    if (navigator.share) {
        navigator.share({
            title: recipe.title,
            text: `Check out this recipe: ${recipe.title}`,
            url: window.location.href
        }).catch(console.error);
    } else {
        
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showNotification('Link copied to clipboard!', 'success');
    }
}


function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}


document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const script = document.createElement('script');
    script.src = 'search-suggestions.js';
    document.body.appendChild(script);
}); 