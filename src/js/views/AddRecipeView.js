//Parent Class
import View from './View';

//Assets
import icons from 'url:../../img/icons.svg';

//Add Recipe View DOM Controller
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _addIngredient = document.querySelector('.ingredientAdd');
  _removeIngredient = document.querySelector('.upload__column.hasfields');
  _openWindowBtn = document.querySelector('.nav__btn--add-recipe');
  _closeWindowBtn = document.querySelector('.btn--close-modal');

  constructor() {
    //Parent Class Inheritance
    super();

    //Init View Specific Handlers
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._addHandlerAdditionalIngredient();
    this._addHandlerRemoveIngredient();
  }

  //Show or Hide the Modal Window
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  //User clicked on the Add Recipe button
  _addHandlerShowWindow() {
    this._openWindowBtn.addEventListener('click', this.toggleWindow.bind(this));
  }

  //User clicked outside modal or on close button
  _addHandlerHideWindow() {
    this._closeWindowBtn.addEventListener(
      'click',
      this.toggleWindow.bind(this)
    );
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  //User Submits the data. Controller Handler.
  _addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      //Format into Object.
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      //Pass to Controller
      handler(data);
    });
  }

  //Add Ingredient to ingredients list
  _addHandlerAdditionalIngredient() {
    this._addIngredient.addEventListener('click', function (e) {
      e.preventDefault();
      //Get Number
      let ingredientNum = this.previousElementSibling
        .querySelector('input')
        .name.replace('ingredient-', '');
      ingredientNum = Number(ingredientNum);

      //Check if Number
      if (ingredientNum > 0 && ingredientNum + 1 <= 25) {
        //Add One for next ingredient and append to DOM
        ingredientNum++;
        this.insertAdjacentHTML(
          'beforebegin',
          `<div class="fieldGroup"><label>Ingredient ${ingredientNum}</label><input type="text" name="ingredient-${ingredientNum}" placeholder="Format: 'Quantity,Unit,Description'" ><button class="removeIngredient" type="button">
              <svg><use href="${icons}#icon-minus-circle"></use></svg>
            </button></div>`
        );
      }
    });
  }

  //Remove Ingredient
  _addHandlerRemoveIngredient() {
    this._removeIngredient.addEventListener('click', function (e) {
      e.preventDefault();

      if (e.target.closest('.removeIngredient')) {
        let target = e.target.closest('.removeIngredient');
        //Get Next Elements and Minus one from ingredient number
        let nextFieldItems = target.closest('.fieldGroup').nextElementSibling;

        while (nextFieldItems) {
          if (nextFieldItems.nodeName === 'DIV') {
            let number = Number(
              nextFieldItems
                .querySelector('input')
                .name.replace('ingredient-', '')
            );
            number--;
            nextFieldItems.querySelector(
              'label'
            ).textContent = `Ingredient ${number}`;
            nextFieldItems.querySelector('input').name = `ingredient-${number}`;
          }

          nextFieldItems = nextFieldItems.nextElementSibling;
        }

        if (
          target.closest('.fieldGroup').nextElementSibling.nodeName === 'DIV' ||
          target.closest('.fieldGroup').previousElementSibling.nodeName ===
            'DIV'
        ) {
          target.closest('.fieldGroup').remove();
        }
      }
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
