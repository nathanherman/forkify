import { async } from 'regenerator-runtime';
import { API_LINK, RESULTS_PER_PAGE_LIMIT, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE_LIMIT,
  },
  bookmarks: [],
};

//Format Recipe from the API to work with the app formatting
const createRecipeObject = function (data) {
  const { recipe } = data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

//Load Recipe From API
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_LINK}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//Search By Term For Recipes From API
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_LINK}?search=${query}&key=${API_KEY}`);
    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const addBookmark = function (recipe) {
  // Add Bookmark to State
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }

  //Save to Local Storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //Delete recipe with id from state

  const index = state.bookmarks.findIndex(item => (item.id = id));
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  //Save to Local Storage
  persistBookmarks();

  //Clear if no Bookmarks exist
  if (!state.bookmarks.length) {
    clearBookmarks();
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};
init();

//Upload And Format User Defined Recipe
export const uploadRecipe = async function (newRecipe) {
  try {
    //Create Array from 6 ingredients
    const ingredients = Object.entries(newRecipe)
      .filter(prop => prop[0].includes('ingredient-') && prop[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please Use the correct format of quantity, unit, description. Thanks!'
          );

        //Organize into correct format
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    //Format Recipe for API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    //Send Recipe to API and Add to State
    const data = await AJAX(
      `${API_LINK}?search=${recipe.title}&key=${API_KEY}`,
      recipe
    );
    state.recipe = createRecipeObject(data);

    //Update Bookmark
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
