//Model
import * as model from './model.js';
//Views
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/AddRecipeView.js';

//Configuration
import { MODAL_CLOSE_SEC } from './config.js';

///////////////////////////////////////

// Recipe Render Controller
const controlRecipes = async function () {
  try {
    //Get Hash from URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Loading Icon
    recipeView.renderSpinner();

    //Update Bookmarks View
    bookmarksView.update(model.state.bookmarks);

    //Update Results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // Loads Recipe & Updates State
    await model.loadRecipe(id);

    // Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

//Search Results Controller
const controlSearchResults = async function () {
  try {
    //Pre Load UI
    resultsView.renderSpinner();

    //Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    //Get Results From API
    await model.loadSearchResults(query);

    //Render Results
    resultsView.render(model.getSearchResultsPage(1));

    //Render Pagination if need be
    paginationView.render(model.state.search);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlPagination = function (page) {
  //Render next Results
  resultsView.render(model.getSearchResultsPage(page));

  //Render next Pagination
  paginationView.render(model.state.search);
};

const controlAddBookmark = function () {
  // Toggle Bookmark Status
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlServings = function (servings) {
  // Update the recipe servings (in state)
  model.updateServings(servings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//Renders A Bookmark in the Bookmark List
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//Passes User Recipe to state.
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading Spinner
    addRecipeView.renderSpinner();

    //Upload new recipe to model
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    //Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🎈 ', err, ' 🎈');
    addRecipeView.renderError(err.message);
  }

  setTimeout(function () {
    location.reload();
  }, 1500);
};

//Attach Controllers to Event Listener
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
