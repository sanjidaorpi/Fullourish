let outputGridElement;
let projectDisplayElement;
let recipeFilter;

// Global filter state
let currentFilters = {
  diet: 'all',
  nutrition: 'all'
};

function filterRecipes() {
  if (recipeFilter) {
    recipeFilter.setDietFilter(currentFilters.diet);
    recipeFilter.setNutritionFilter(currentFilters.nutrition);
  }
}

function updateFilterButtonStates() {
  // Update all filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    
    // Get the filter section this button belongs to
    const filterSection = btn.closest('.filter-section');
    const sectionTitle = filterSection.querySelector('.filter-title').textContent;
    
    if (sectionTitle === 'Diet Type') {
      // This is a diet filter button
      if (currentFilters.diet === 'all' && btn.textContent.includes('Show All')) {
        btn.classList.add('active');
      } else if (currentFilters.diet !== 'all' && btn.textContent.toLowerCase().includes(currentFilters.diet.toLowerCase())) {
        btn.classList.add('active');
      }
    } else if (sectionTitle === 'Nutrition Focus') {
      // This is a nutrition filter button
      if (currentFilters.nutrition === 'all' && btn.textContent.includes('Show All')) {
        btn.classList.add('active');
      } else if (currentFilters.nutrition !== 'all' && btn.textContent.toLowerCase().includes(currentFilters.nutrition.replace('-', ' ').toLowerCase())) {
        btn.classList.add('active');
      }
    }
  });
}

function setDietFilter(diet) {
  currentFilters.diet = diet;
  filterRecipes();
  updateFilterButtonStates();
}

function setNutritionFilter(nutrition) {
  currentFilters.nutrition = nutrition;
  filterRecipes();
  updateFilterButtonStates();
}

function clearAllFilters() {
  currentFilters.diet = 'all';
  currentFilters.nutrition = 'all';
  filterRecipes();
  updateFilterButtonStates();
}

document.addEventListener("DOMContentLoaded", function(){
  outputGridElement = document.getElementById("outputGrid");
  projectDisplayElement = document.getElementById("projectDisplay");

  // Initialize the recipe filter system from api.js
  if (typeof RecipeFilter !== 'undefined') {
    recipeFilter = new RecipeFilter();
    
    // Fetch initial recipes from Spoonacular
    recipeFilter.fetchRecipes();
  } else {
    console.error('RecipeFilter class not found. Make sure api.js is loaded.');
    // Fallback: show error message
    if (outputGridElement) {
      outputGridElement.innerHTML = '<div class="error-message">Failed to load recipe system. Please refresh the page.</div>';
    }
  }

  // Add event listeners for filter buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-btn')) {
      const buttonText = e.target.textContent;
      
      // Handle diet type filters
      if (buttonText.includes('Show All') && e.target.closest('.filter-section').querySelector('.filter-title').textContent === 'Diet Type') {
        setDietFilter('all');
      } else if (buttonText.includes('Show All') && e.target.closest('.filter-section').querySelector('.filter-title').textContent === 'Nutrition Focus') {
        setNutritionFilter('all');
      } else if (buttonText.includes('Pescatarian')) {
        setDietFilter('pescatarian');
      } else if (buttonText.includes('Vegetarian')) {
        setDietFilter('vegetarian');
      } else if (buttonText.includes('Vegan')) {
        setDietFilter('vegan');
      } else if (buttonText.includes('Gluten-Free')) {
        setDietFilter('gluten-free');
      } else if (buttonText.includes('Dairy-Free')) {
        setDietFilter('dairy-free');
      }
      // Handle nutrition filters (including the moved ones)
      else if (buttonText.includes('Protein')) {
        setNutritionFilter('high-protein');
      } else if (buttonText.includes('Fiber')) {
        setNutritionFilter('high-fiber');
      } else if (buttonText.includes('Calcium')) {
        setNutritionFilter('high-calcium');
      } else if (buttonText.includes('Keto-Friendly')) {
        setNutritionFilter('keto-friendly');
      } else if (buttonText.includes('Low-Carb')) {
        setNutritionFilter('low-carb');
      } else if (buttonText.includes('Low-Sodium')) {
        setNutritionFilter('low-sodium');
      } else if (buttonText.includes('Heart-Healthy')) {
        setNutritionFilter('heart-healthy');
      } else if (buttonText.includes('Paleo')) {
        setNutritionFilter('paleo');
      }
    }
  });

  // Add search functionality
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  
  if (searchButton) {
    searchButton.addEventListener('click', performSearch);
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
});

function performSearch() {
  const searchTerm = document.querySelector('.search-input').value.toLowerCase();
  
  if (searchTerm.trim() === '') {
    filterRecipes();
    return;
  }
  
  // Use the recipe filter's search functionality if available
  if (recipeFilter && recipeFilter.recipes) {
    const searchResults = recipeFilter.recipes.filter(recipe => {
      const title = recipe.title ? recipe.title.toLowerCase() : '';
      const diets = recipe.diets ? recipe.diets.join(' ').toLowerCase() : '';
      
      return title.includes(searchTerm) || diets.includes(searchTerm);
    });
    
    // Display search results
    displaySearchResults(searchResults);
  }
}

function displaySearchResults(results) {
  if (!outputGridElement) return;
  
  outputGridElement.innerHTML = '';
  
  if (results.length === 0) {
    outputGridElement.innerHTML = '<p class="no-results">No recipes found matching your search.</p>';
    return;
  }
  
  // Apply current filters to search results
  const filteredResults = results.filter(recipe => {
    const dietMatch = currentFilters.diet === 'all' || 
                     (recipe.diets && recipe.diets.includes(currentFilters.diet));
    const nutritionMatch = currentFilters.nutrition === 'all' || 
                          checkNutritionCriteria(recipe, currentFilters.nutrition);
    return dietMatch && nutritionMatch;
  });
  
  if (filteredResults.length === 0) {
    outputGridElement.innerHTML = '<p class="no-results">No recipes found for the selected filters and search term.</p>';
    return;
  }
  
  // Display filtered search results
  filteredResults.slice(0, 20).forEach(recipe => {
    createRecipeCard(recipe);
  });
}

function checkNutritionCriteria(recipe, nutritionType) {
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
    default:
      return true;
  }
}

function createRecipeCard(recipe) {
  const recipeCard = document.createElement("div");
  recipeCard.className = "recipe-card";
  
  // Recipe info
  const recipeInfo = document.createElement("div");
  recipeInfo.className = "recipe-info";
  
  // Recipe title
  const recipeTitle = document.createElement("h3");
  recipeTitle.className = "recipe-title";
  recipeTitle.textContent = recipe.title || 'Untitled Recipe';
  
  // Recipe meta (time and servings)
  const recipeMeta = document.createElement("div");
  recipeMeta.className = "recipe-meta";
  if (recipe.readyInMinutes) {
    const readyTime = document.createElement("span");
    readyTime.className = "ready-time";
    readyTime.innerHTML = `⏱️ ${recipe.readyInMinutes} min`;
    recipeMeta.appendChild(readyTime);
  }
  if (recipe.servings) {
    const servings = document.createElement("span");
    servings.className = "servings";
    servings.innerHTML = `👥 ${recipe.servings} servings`;
    recipeMeta.appendChild(servings);
  }
  
  // Nutrition info
  const nutritionInfo = document.createElement("div");
  nutritionInfo.className = "nutrition-info";
  if (recipe.nutrition && recipe.nutrition.nutrients) {
    const nutritionValues = document.createElement("div");
    nutritionValues.className = "nutrition-values";
    
    const nutrients = recipe.nutrition.nutrients;
    const protein = nutrients.find(n => n.name === 'Protein');
    const fiber = nutrients.find(n => n.name === 'Fiber');
    const calcium = nutrients.find(n => n.name === 'Calcium');
    
    if (protein) {
      const nutrient = document.createElement("span");
      nutrient.className = "nutrient";
      nutrient.textContent = `Protein: ${protein.amount}g`;
      nutritionValues.appendChild(nutrient);
    }
    if (fiber) {
      const nutrient = document.createElement("span");
      nutrient.className = "nutrient";
      nutrient.textContent = `Fiber: ${fiber.amount}g`;
      nutritionValues.appendChild(nutrient);
    }
    if (calcium) {
      const nutrient = document.createElement("span");
      nutrient.className = "nutrient";
      nutrient.textContent = `Calcium: ${calcium.amount}mg`;
      nutritionValues.appendChild(nutrient);
    }
    
    nutritionInfo.appendChild(nutritionValues);
  } else {
    const noNutrition = document.createElement("span");
    noNutrition.className = "no-nutrition";
    noNutrition.textContent = "Nutrition info not available";
    nutritionInfo.appendChild(noNutrition);
  }
  
  // Diet tags
  const dietTags = document.createElement("div");
  dietTags.className = "diet-tags";
  if (recipe.diets && recipe.diets.length > 0) {
    recipe.diets.forEach(diet => {
      const dietTag = document.createElement("span");
      dietTag.className = "diet-tag";
      dietTag.textContent = diet;
      dietTags.appendChild(dietTag);
    });
  } else {
    const noDiet = document.createElement("span");
    noDiet.className = "diet-tag";
    noDiet.textContent = "No diet info";
    dietTags.appendChild(noDiet);
  }
  
  // Recipe actions
  const recipeActions = document.createElement("div");
  recipeActions.className = "recipe-actions";
  const viewRecipeBtn = document.createElement("button");
  viewRecipeBtn.className = "view-recipe-btn";
  viewRecipeBtn.textContent = "View Recipe";
  viewRecipeBtn.onclick = function() {
    const recipeUrl = recipe.sourceUrl || recipe.spoonacularSourceUrl;
    if (recipeUrl) {
      window.open(recipeUrl, '_blank');
    } else {
      console.log('No recipe URL available for recipe:', recipe.id);
    }
  };
  recipeActions.appendChild(viewRecipeBtn);
  
  // Assemble the card
  recipeInfo.appendChild(recipeTitle);
  if (recipeMeta.children.length > 0) {
    recipeInfo.appendChild(recipeMeta);
  }
  recipeInfo.appendChild(nutritionInfo);
  recipeInfo.appendChild(dietTags);
  recipeInfo.appendChild(recipeActions);
  
  recipeCard.appendChild(recipeInfo);
  
  outputGridElement.appendChild(recipeCard);
}

function viewRecipeDetails(recipeId) {
  // This could open a modal or navigate to a detailed view
  console.log('Viewing recipe:', recipeId);
  // You can implement a modal or new page here
}

