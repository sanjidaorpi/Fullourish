let recipeTitleElement;
let outputGridElement;
let projectDisplayElement;

let recipeCollection = [
  {
    "itemTitle" : "Mushroom Lentil Risotto",
    "category" : "protein",
    "diet" : "Vegetarian",
    "id" : "1",
    "data": "11g Protein",
    "link": "https://avocadoskillet.com/mushroom-lentil-risotto/",
    "image" : "protein_recipe1.jpeg"
  },
  {
    "itemTitle" : "Black Pepper Tofu & Cauliflower",
    "category" : "protein",
    "diet" : "Vegan",
    "id" : "2",
    "data": "13g Protein",
    "link": "https://crumbsandcaramel.com/black-pepper-tofu-cauliflower/",
    "image" : "protein_recipe2.jpeg"
  },
  {
    "itemTitle" : "Chili Crunch Tofu",
    "diet" : "Vegan",
    "category" : "protein",
    "id" : "3",
    "data": "10.7g Protein",
    "link": "https://pinchofyum.com/chili-crunch-tofu",
    "image" : "protein_recipe3.webp"
  },

  {
    "itemTitle" : "Tofu Stir Fry",
    "category" : "protein",
    "diet" : "Vegetarian",
    "id" : "4",
    "data": "15g Protein",
    "link": "https://dishingouthealth.com/easy-tofu-stir-fry/#recipe",
    "image" : "protein_recipe4.jpeg"
  },
  {
    "itemTitle" : "Kale and Quinoa Salad",
    "category" : "protein",
    "diet" : "Vegan",
    "id" : "5",
    "data": "11g Protein",
    "link": "https://theliveinkitchen.com/warm-kale-and-quinoa-salad/",
    "image" : "protein_recipe5.jpeg"
  },
  {
    "itemTitle" : "Coconut Tofu Curry",
    "diet" : "Vegan",
    "category" : "protein",
    "id" : "6",
    "data": "14.1g Protein",
    "link": "https://www.acouplecooks.com/tofu-curry/",
    "image" : "protein_recipe6.jpeg"
  },



  {
    "itemTitle" : "Butternut Squash Soup with Apple",
    "category" : "fiber",
    "diet" : "Vegan",
    "id" : "7",
    "data": "6g Fiber per serving",
    "link": "https://www.eatingwell.com/recipe/275510/slow-cooker-vegan-butternut-squash-soup-with-apple/",
    "image" : "fiber_recipe1.webp"
  },
  {
    "itemTitle" : "Chickpea and Vegetable Coconut Curry",
    "category" : "fiber",
    "diet" : "Vegan",
    "id" : "8",
    "data": "32g Fiber",
    "link": "https://www.purewow.com/recipes/chickpea-vegetable-coconut-curry",
    "image" : "fiber_recipe2.webp"
  },
  {
    "itemTitle" : "White Bean & Barley Stew with Kale & Eggs",
    "diet" : "Vegetarian",
    "category" : "fiber",
    "id" : "9",
    "data": "14g Fiber",
    "link": "https://iamafoodblog.com/spicy-chili-crisp-white-bean-and-barley-stew-with-kale-and-eggs/",
    "image" : "fiber_recipe3.jpeg"
  },



  {
    "itemTitle" : "Sticky Ginger Sesame Tofu & Veggies",
    "category" : "calcium",
    "diet" : "Vegan",
    "id" : "14",
    "data": "161mg Calcium",
    "link": "https://www.veganricha.com/sticky-ginger-sesame-tofu-veggies/#recipe",
    "image" : "calcium_recipe1.webp"
  },
  {
    "itemTitle" : "Tofu Broccoli Bok Choy Stir Fry",
    "category" : "calcium",
    "diet" : "Vegan",
    "id" : "15",
    "data": "600mg Calcium",
    "link": "https://www.veganricha.com/tofu-broccoli-bok-choy-stir-fry-soba/#recipe",
    "image" : "calcium_recipe2.webp"
  },
  {
    "itemTitle" : "Spinach & Mushroom Quiche",
    "diet" : "Vegetarian",
    "category" : "calcium",
    "id" : "16",
    "data": "358mg Calcium",
    "link": "https://www.eatingwell.com/recipe/278023/spinach-mushroom-quiche/",
    "image" : "fiber_recipe3.webp"
  },
];

function filterSelection(category, diet, specialCategory) {
  outputGridElement.innerHTML = ""; // Clear previous content

  for (let i = 0; i < recipeCollection.length; i++) {
    if (
      (category === 'all' || recipeCollection[i]["category"] === category) &&
      (diet === 'all' || recipeCollection[i]["diet"] === diet) &&
      (specialCategory === 'all' || recipeCollection[i]["category"] === specialCategory)
    ) {
      createProjectPreview(recipeCollection[i]);
    }
  }
}
document.addEventListener("DOMContentLoaded", function(){

  /* Get page element references */
  recipeTitleElement = document.getElementById("pageTitle");
  outputGridElement = document.getElementById("outputGrid");
  projectDisplayElement = document.getElementById("projectDisplay");

  /* Get URL Params */
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let urlSection = urlParams.get('section');
  let urlID = urlParams.get('id');

  if (urlSection != "item") { /* Display project previews in grid */

    if (diet == "protein") {
      recipeTitleElement.innerText = "High Protein Recipes";
    }
    else if (diet == "fiber") {
      recipeTitleElement.innerText = "High Fiber Recipes";
    }
    else if (diet == "fiber") {
      recipeTitleElement.innerText = "High Calcium Recipes:";
    }

    /* Create thumbnails for matching category, or all */
    for (let i = 0; i < recipeCollection.length; i++) {
      if (recipeCollection[i]["category"] == urlSection || urlSection == "" || urlSection == null){
        createProjectPreview(recipeCollection[i]);
      }
    }

  }
  else {
    /* Display individual project by trying to match the "ID" value */
    for (let i = 0; i < recipeCollection.length; i++) {
      if (recipeCollection[i]["id"] == urlID) {
        createProjectPage(recipeCollection[i]);
      }
    }
  }
  document.querySelector(".btn.active").addEventListener("click", function() {
    filterSelection('all', 'all');
  });
});

function createProjectPreview(incomingJSON) {

  let newPreviewLink = document.createElement("A");
  newPreviewLink.href = incomingJSON["link"];

  let newPreviewElement = document.createElement("DIV");
  newPreviewLink.appendChild(newPreviewElement);

  let newPreviewThumbnail = document.createElement("IMG");
  newPreviewThumbnail.classList.add("thumbnail");
  newPreviewThumbnail.src = incomingJSON["image"];
  newPreviewElement.appendChild(newPreviewThumbnail);

  let newPreviewDiet = document.createElement("DIET");
  newPreviewDiet.classList.add("previewDiet");
  newPreviewDiet.innerText = incomingJSON["diet"];
  newPreviewElement.appendChild(newPreviewDiet);

  let newPreviewTitle = document.createElement("P");
  newPreviewTitle.classList.add("previewTitle");
  newPreviewTitle.innerText = incomingJSON["itemTitle"];
  newPreviewElement.appendChild(newPreviewTitle);

  let newPreviewData = document.createElement("DATA");
  newPreviewData.classList.add("previewData");
  newPreviewData.innerText = incomingJSON["data"];
  newPreviewElement.appendChild(newPreviewData);

  outputGridElement.appendChild(newPreviewLink);

}

function createProjectPage(incomingJSON) {
  recipeTitleElement.innerText = incomingJSON["itemTitle"];

  let newProjectElement = document.createElement("DIV");

  let newProjectDiet = document.createElement("P");
  newProjectDiet.classList.add("diet");
  newProjectDiet.innerText = "Diet: " + incomingJSON["diet"];
  newProjectElement.appendChild(newProjectDiet);

  if (incomingJSON["data"]) {
    let newProjectData = document.createElement("P");
    newProjectData.classList.add("data");
    newProjectData.innerText = "Data: " + incomingJSON["data"];
    newProjectElement.appendChild(newProjectData);
  }

  if (incomingJSON["link"]) {
    let newProjectLink = document.createElement("A");
    newProjectLink.href = incomingJSON["link"];
    newProjectLink.innerText = "Recipe Link";
    newProjectElement.appendChild(newProjectLink);
  }

  let newProjectImage = document.createElement("IMG");
  newProjectImage.classList.add("projectHeroImage");
  newProjectImage.src = incomingJSON["image"];
  newProjectElement.appendChild(newProjectImage);

  projectDisplayElement.appendChild(newProjectElement);
}

