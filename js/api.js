// Import configuration
// const CONFIG = require('./config.js'); // Uncomment if using Node.js

// Spoonacular API Configuration
const SPOONACULAR_API_KEY = CONFIG.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = CONFIG.SPOONACULAR_BASE_URL;

// Recipe filtering system
class RecipeFilter {
    constructor() {
        this.dietTypes = CONFIG.DIET_TYPES;
        this.nutritionTypes = CONFIG.NUTRITION_TYPES;
        this.currentDietFilter = 'all';
        this.currentNutritionFilter = 'all';
        this.recipes = [];
        this.filteredRecipes = [];
    }

    // Set diet filter
    setDietFilter(diet) {
        this.currentDietFilter = diet;
        this.applyFilters();
    }

    // Set nutrition filter
    setNutritionFilter(nutrition) {
        this.currentNutritionFilter = nutrition;
        this.applyFilters();
    }

    // Apply both filters
    applyFilters() {
        this.filteredRecipes = this.recipes.filter(recipe => {
            const dietMatch = this.currentDietFilter === 'all' || 
                            (recipe.diets && recipe.diets.includes(this.currentDietFilter));
            const nutritionMatch = this.currentNutritionFilter === 'all' || 
                                 this.checkNutritionCriteria(recipe, this.currentNutritionFilter);
            return dietMatch && nutritionMatch;
        });
        
        this.displayRecipes();
    }

    // Check if recipe meets nutrition criteria
    checkNutritionCriteria(recipe, nutritionType) {
        if (!recipe.nutrition || !recipe.nutrition.nutrients) return false;
        
        const nutrients = recipe.nutrition.nutrients;
        
        switch(nutritionType) {
            case 'high-protein':
                const protein = nutrients.find(n => n.name === 'Protein');
                return protein && protein.amount >= CONFIG.NUTRITION_THRESHOLDS['high-protein'];
            case 'high-fiber':
                const fiber = nutrients.find(n => n.name === 'Fiber');
                return fiber && fiber.amount >= CONFIG.NUTRITION_THRESHOLDS['high-fiber'];
            case 'high-calcium':
                const calcium = nutrients.find(n => n.name === 'Calcium');
                return calcium && calcium.amount >= CONFIG.NUTRITION_THRESHOLDS['high-calcium'];
            case 'keto-friendly':
                // Check if recipe has low carbs and high fat
                const carbs = nutrients.find(n => n.name === 'Carbohydrates');
                const fat = nutrients.find(n => n.name === 'Fat');
                return carbs && fat && carbs.amount <= 20 && fat.amount >= 15;
            case 'low-carb':
                const carbsLow = nutrients.find(n => n.name === 'Carbohydrates');
                return carbsLow && carbsLow.amount <= 25;
            case 'low-sodium':
                const sodium = nutrients.find(n => n.name === 'Sodium');
                return sodium && sodium.amount <= 500;
            case 'heart-healthy':
                // Check for low saturated fat and good fiber
                const satFat = nutrients.find(n => n.name === 'Saturated Fat');
                const fiberHeart = nutrients.find(n => n.name === 'Fiber');
                return satFat && fiberHeart && satFat.amount <= 5 && fiberHeart.amount >= 5;
            case 'paleo':
                // Paleo is more about ingredients, but we can check for low carbs
                const carbsPaleo = nutrients.find(n => n.name === 'Carbohydrates');
                return carbsPaleo && carbsPaleo.amount <= 30;
            default:
                return true;
        }
    }

    // Fetch recipes from Spoonacular API for all diet types
    async fetchRecipes() {
        try {
            // Show loading state
            const outputGrid = document.getElementById('outputGrid');
            if (outputGrid) {
                outputGrid.innerHTML = `
                    <div class="loading">
                        <p>🍳 Fetching delicious recipes from Spoonacular...</p>
                        <p>This may take a few moments...</p>
                    </div>
                `;
            }

            // Fetch recipes for each diet type
            const allRecipes = [];
            
            for (const diet of this.dietTypes) {
                try {
                    const url = `${SPOONACULAR_BASE_URL}/complexSearch?apiKey=${SPOONACULAR_API_KEY}&diet=${diet}&addRecipeInformation=true&fillIngredients=true&addRecipeNutrition=true&number=25&instructionsRequired=true`;
                    
                    const response = await fetch(url);
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.results && data.results.length > 0) {
                            allRecipes.push(...data.results);
                        }
                    } else {
                        const errorText = await response.text();
                        console.error(`API error for ${diet}:`, response.status, response.statusText);
                    }
                } catch (error) {
                    console.error(`Failed to fetch ${diet} recipes:`, error);
                }
            }
            
            if (allRecipes.length === 0) {
                this.displayError('We couldn\'t find any recipes at the moment. This might be due to high demand or temporary service issues. Please try again in a few minutes, or check back later.');
                return;
            }
            
            // Remove duplicates based on recipe ID
            const uniqueRecipes = allRecipes.filter((recipe, index, self) => 
                index === self.findIndex(r => r.id === recipe.id)
            );
            
            this.recipes = uniqueRecipes;
            this.filteredRecipes = [...this.recipes];
            
            this.displayRecipes();
            
        } catch (error) {
            console.error('Error fetching recipes:', error);
            this.displayError('We\'re experiencing some technical difficulties loading recipes right now. Please refresh the page and try again, or check back in a few minutes.');
        }
    }

    // Display filtered recipes
    displayRecipes() {
        const outputGrid = document.getElementById('outputGrid');
        if (!outputGrid) {
            console.error('Output grid element not found');
            return;
        }

        // Clear previous results
        outputGrid.innerHTML = '';

        if (this.filteredRecipes.length === 0) {
            outputGrid.innerHTML = `
                <div class="no-results">
                    <p>No recipes found for the selected filters.</p>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        console.log(`Displaying ${this.filteredRecipes.length} filtered recipes`);

        // Display each recipe
        this.filteredRecipes.forEach(recipe => {
            this.createRecipeCard(recipe);
        });
    }

    // Create and display a recipe card
    createRecipeCard(recipe) {
        const container = document.getElementById('outputGrid');
        if (!container) {
            console.error('Output grid container not found');
            return;
        }

        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        
        const title = recipe.title || 'Untitled Recipe';
        const readyTime = recipe.readyInMinutes || 'N/A';
        const servings = recipe.servings || 'N/A';
        
        // Get nutrition info
        const nutrition = this.getNutritionInfo(recipe);
        
        // Get diet types
        const diets = recipe.diets || [];
        
        recipeCard.innerHTML = `
            <div class="recipe-info">
                <h3 class="recipe-title">${title}</h3>
                <div class="recipe-meta">
                    <span class="ready-time">⏱️ ${readyTime} min</span>
                    <span class="servings">👥 ${servings} servings</span>
                </div>
                <div class="nutrition-info">
                    ${nutrition}
                </div>
                <div class="diet-tags">
                    ${diets.map(diet => `<span class="diet-tag">${diet}</span>`).join('')}
                </div>
                <div class="recipe-actions">
                    <button class="view-recipe-btn" onclick="window.open('${recipe.sourceUrl || recipe.spoonacularSourceUrl || '#'}', '_blank')">View Recipe</button>
                </div>
            </div>
        `;
        
        container.appendChild(recipeCard);
    }

    // Get nutrition information for display
    getNutritionInfo(recipe) {
        if (!recipe.nutrition || !recipe.nutrition.nutrients) {
            return '<span class="no-nutrition">Nutrition info not available</span>';
        }

        const nutrients = recipe.nutrition.nutrients;
        const protein = nutrients.find(n => n.name === 'Protein');
        const fiber = nutrients.find(n => n.name === 'Fiber');
        const calcium = nutrients.find(n => n.name === 'Calcium');

        let nutritionHtml = '<div class="nutrition-values">';
        if (protein) nutritionHtml += `<span class="nutrient">Protein: ${protein.amount}g</span>`;
        if (fiber) nutritionHtml += `<span class="nutrient">Fiber: ${fiber.amount}g</span>`;
        if (calcium) nutritionHtml += `<span class="nutrient">Calcium: ${calcium.amount}mg</span>`;
        nutritionHtml += '</div>';

        return nutritionHtml;
    }

    // Display error message
    displayError(message) {
        const outputGrid = document.getElementById('outputGrid');
        if (outputGrid) {
            outputGrid.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">🍽️</div>
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="retry-button">Try Again</button>
                </div>
            `;
        }
    }
    
    // View detailed recipe information
    viewRecipeDetails(recipeId) {
        // This could open a modal or navigate to a detailed view
        console.log('Viewing recipe:', recipeId);
        // You can implement a modal or new page here
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RecipeFilter;
}
