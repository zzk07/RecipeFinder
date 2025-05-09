const translations = {
    en: {
        'home': 'Home',
        'find-recipes': 'Find Recipes',
        'categories': 'Categories',
        'favorites': 'Favorites',
        'hero-title': 'Find Recipes Based on Your Ingredients',
        'hero-description': 'Enter the ingredients you have, and we\'ll suggest delicious recipes you can make!',
        'enter-ingredient': 'Enter an ingredient...',
        'find-recipes-button': 'Find Recipes',
        'recipe-suggestions': 'Recipe Suggestions',
        'any-diet': 'Any Diet',
        'vegetarian': 'Vegetarian',
        'vegan': 'Vegan',
        'gluten-free': 'Gluten Free',
        'any-time': 'Any Time',
        'under-15-mins': 'Under 15 mins',
        'under-30-mins': 'Under 30 mins',
        'under-1-hour': 'Under 1 hour',
        'any-difficulty': 'Any Difficulty',
        'easy': 'Easy',
        'medium': 'Medium',
        'hard': 'Hard',
        'popular-categories': 'Popular Categories',
        'breakfast': 'Breakfast',
        'lunch': 'Lunch',
        'dinner': 'Dinner',
        'desserts': 'Desserts',
        'quick-easy': 'Quick & Easy',
        'ingredients': {
            'tomato': 'tomato',
            'potato': 'potato',
            'onion': 'onion',
            'garlic': 'garlic',
            'carrot': 'carrot',
            'chicken': 'chicken',
            'beef': 'beef',
            'pork': 'pork',
            'rice': 'rice',
            'pasta': 'pasta',
            'egg': 'egg',
            'milk': 'milk',
            'cheese': 'cheese',
            'butter': 'butter',
            'oil': 'oil',
            'salt': 'salt',
            'pepper': 'pepper',
            'sugar': 'sugar',
            'flour': 'flour',
            'bread': 'bread'
        }
    },
    uk: {
        'home': 'Головна',
        'find-recipes': 'Знайти рецепти',
        'categories': 'Категорії',
        'favorites': 'Улюблені',
        'hero-title': 'Знайдіть рецепти на основі ваших інгредієнтів',
        'hero-description': 'Введіть інгредієнти, які у вас є, і ми запропонуємо смачні рецепти!',
        'enter-ingredient': 'Введіть інгредієнт...',
        'find-recipes-button': 'Знайти рецепти',
        'recipe-suggestions': 'Пропозиції рецептів',
        'any-diet': 'Будь-яка дієта',
        'vegetarian': 'Вегетаріанська',
        'vegan': 'Веганська',
        'gluten-free': 'Без глютену',
        'any-time': 'Будь-який час',
        'under-15-mins': 'До 15 хв',
        'under-30-mins': 'До 30 хв',
        'under-1-hour': 'До 1 години',
        'any-difficulty': 'Будь-яка складність',
        'easy': 'Легко',
        'medium': 'Середньо',
        'hard': 'Складно',
        'popular-categories': 'Популярні категорії',
        'breakfast': 'Сніданок',
        'lunch': 'Обід',
        'dinner': 'Вечеря',
        'desserts': 'Десерти',
        'quick-easy': 'Швидко та легко',
        'ingredients': {
            'tomato': 'помідор',
            'potato': 'картопля',
            'onion': 'цибуля',
            'garlic': 'часник',
            'carrot': 'морква',
            'chicken': 'курка',
            'beef': 'яловичина',
            'pork': 'свинина',
            'rice': 'рис',
            'pasta': 'макарони',
            'egg': 'яйце',
            'milk': 'молоко',
            'cheese': 'сир',
            'butter': 'масло',
            'oil': 'олія',
            'salt': 'сіль',
            'pepper': 'перець',
            'sugar': 'цукор',
            'flour': 'борошно',
            'bread': 'хліб'
        }
    }
};

// Function to change language
function changeLanguage(lang) {
    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update all elements with data-lang-placeholder attribute
    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    // Update ingredient tags if they exist
    const selectedIngredients = document.getElementById('selectedIngredients');
    if (selectedIngredients) {
        const tags = selectedIngredients.querySelectorAll('.ingredient-tag');
        tags.forEach(tag => {
            const ingredientKey = tag.getAttribute('data-ingredient');
            if (ingredientKey && translations[lang].ingredients[ingredientKey]) {
                tag.textContent = translations[lang].ingredients[ingredientKey];
            }
        });
    }

    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Function to get ingredient translation
function getIngredientTranslation(ingredient, lang) {
    // First try to find exact match
    if (translations[lang].ingredients[ingredient.toLowerCase()]) {
        return translations[lang].ingredients[ingredient.toLowerCase()];
    }

    // If no exact match, try to find in English ingredients
    const englishIngredients = Object.entries(translations.en.ingredients);
    const matchingIngredient = englishIngredients.find(([key, value]) => 
        value.toLowerCase() === ingredient.toLowerCase()
    );

    if (matchingIngredient) {
        return translations[lang].ingredients[matchingIngredient[0]];
    }

    // If no match found, return original ingredient
    return ingredient;
}

// Initialize language selector
document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    
    // Set initial language from localStorage or default to English
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    languageSelect.value = savedLanguage;
    changeLanguage(savedLanguage);

    // Add event listener for language change
    languageSelect.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
}); 