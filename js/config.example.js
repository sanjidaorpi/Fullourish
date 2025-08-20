// Example configuration file for Fullourish
// Copy this file to config.js and add your actual API key

const CONFIG = {
    SPOONACULAR_API_KEY: 'YOUR_SPOONACULAR_API_KEY_HERE', // Get from https://spoonacular.com/food-api
    SPOONACULAR_BASE_URL: 'https://api.spoonacular.com/recipes',
    MAX_RECIPES: 20,
    NUTRITION_THRESHOLDS: {
        'high-protein': 20, // grams
        'high-fiber': 8,    // grams
        'high-calcium': 200 // milligrams
    },
    DIET_TYPES: [
        'pescatarian', 
        'vegetarian', 
        'vegan', 
        'gluten-free', 
        'dairy-free'
    ],
    NUTRITION_TYPES: [
        'high-protein', 
        'high-fiber', 
        'high-calcium',
        'keto-friendly',
        'low-carb',
        'low-sodium',
        'heart-healthy',
        'paleo'
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
