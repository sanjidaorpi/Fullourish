// Configuration file for Fullourish
// This site works immediately without any file editing required!

const CONFIG = {
    // Using a demo API key that works for basic testing
    // For production use, replace with your own Spoonacular API key
    SPOONACULAR_API_KEY: '5b37952269e64363b5d689ddbfd7503e',
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
