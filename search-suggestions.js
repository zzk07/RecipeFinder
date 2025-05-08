const commonIngredients = [

    'chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'sausage', 'bacon',

    'fish', 'salmon', 'tuna', 'shrimp', 'crab', 'mussel', 'oyster', 'squid',

    'potato', 'tomato', 'onion', 'garlic', 'carrot', 'bell pepper', 'cucumber',
    'eggplant', 'zucchini', 'broccoli', 'cauliflower', 'spinach', 'lettuce',
    'cabbage', 'mushroom', 'corn', 'peas', 'green beans', 'asparagus',

    'apple', 'banana', 'orange', 'lemon', 'lime', 'grape', 'strawberry',
    'blueberry', 'raspberry', 'peach', 'pear', 'pineapple', 'mango',

    'milk', 'cheese', 'yogurt', 'cream', 'butter', 'sour cream',

    'rice', 'pasta', 'bread', 'flour', 'cornmeal', 'oats', 'quinoa',
    'buckwheat', 'barley', 'couscous',

    'beans', 'lentils', 'chickpeas', 'peas',

    'salt', 'pepper', 'basil', 'oregano', 'thyme', 'rosemary', 'parsley',
    'cilantro', 'dill', 'cumin', 'paprika', 'cinnamon', 'nutmeg',

    'olive oil', 'vegetable oil', 'soy sauce', 'vinegar', 'honey',
    'mustard', 'ketchup', 'mayonnaise',

    'almond', 'walnut', 'peanut', 'cashew', 'sesame', 'sunflower seeds',

    'eggs', 'tofu', 'tempeh', 'seitan'
];


const recipeCategories = [
    'italian', 'mexican', 'chinese', 'indian', 'japanese',
    'mediterranean', 'american', 'thai', 'french', 'greek'
];


function initAutocomplete() {
    const ingredientInput = document.getElementById('ingredientInput');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions-container';
    ingredientInput.parentNode.appendChild(suggestionsContainer);

    let selectedIndex = -1;

    ingredientInput.addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();
        if (value.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }


        const suggestions = [...new Set(commonIngredients.filter(ingredient => 
            ingredient.toLowerCase().includes(value)
        ))].slice(0, 8);

        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions
                .map((suggestion, index) => `
                    <div class="suggestion-item ${index === selectedIndex ? 'selected' : ''}" 
                         onclick="selectSuggestion('${suggestion}')"
                         onmouseover="highlightSuggestion(${index})">
                        <i class="fas fa-search"></i>
                        ${highlightMatch(suggestion, value)}
                    </div>
                `)
                .join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });


    ingredientInput.addEventListener('keydown', (e) => {
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
                updateSelectedSuggestion(suggestions);
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                updateSelectedSuggestion(suggestions);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    selectSuggestion(suggestions[selectedIndex].textContent.trim());
                }
                break;
            case 'Escape':
                suggestionsContainer.style.display = 'none';
                selectedIndex = -1;
                break;
        }
    });


    document.addEventListener('click', (e) => {
        if (!e.target.closest('.ingredient-input')) {
            suggestionsContainer.style.display = 'none';
            selectedIndex = -1;
        }
    });
}


function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}


function highlightSuggestion(index) {
    selectedIndex = index;
    const suggestions = document.querySelectorAll('.suggestion-item');
    updateSelectedSuggestion(suggestions);
}


function updateSelectedSuggestion(suggestions) {
    suggestions.forEach((suggestion, index) => {
        suggestion.classList.toggle('selected', index === selectedIndex);
    });
}


function selectSuggestion(ingredient) {
    const ingredientInput = document.getElementById('ingredientInput');
    ingredientInput.value = ingredient;
    document.querySelector('.suggestions-container').style.display = 'none';
    document.getElementById('addIngredient').click();
    selectedIndex = -1;
}


document.addEventListener('DOMContentLoaded', initAutocomplete); 