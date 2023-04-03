//Assets
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  //Calls Rendering Functions and Recieves Data
  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to DOM
   * @returns {undefined | string} A markup string is returned if render is false
   * @this {Object} View Instance
   * @author Nathan Herman
   * @todo Finish Implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Update Method Algorithm for Only Updating parts of Dom that are being modified.
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.children);
    const currElements = Array.from(this._parentElement.children);

    //Update Text
    const traverseChanges = function (currEl, newEl) {
      if (!newEl?.isEqualNode(currEl)) {
        //Changes Detected
        if (newEl.children.length > 0) {
          //Check if there are children nodes and update them individually if they pass the checks
          const childEls = Array.from(newEl?.children);
          const currChildEls = Array.from(currEl?.children);

          //For Updating any direct text or attributes that might differ between parent elements
          const childNodes = Array.from(newEl.cloneNode(true).childNodes);
          const currChildNodes = Array.from(currEl.cloneNode(true).childNodes);

          childEls.forEach(function (childEl, j) {
            const currChildEl = currChildEls[j];
            traverseChanges(currChildEl, childEl);
          });

          //Check if the Child text is different or Attributes of parent element is different
          //Text
          childNodes.forEach(function (childNode, j) {
            if (childNode.nodeType === Node.TEXT_NODE) {
              if (currChildNodes[j].nodeType === Node.TEXT_NODE) {
                if (childNode.nodeValue !== currChildNodes[j].nodeValue) {
                  console.log(
                    'Text Update: ',
                    childNode.nodeValue,
                    ' to ',
                    currChildNodes[j].nodeValue
                  );
                  currEl.replaceChild(childNode, currChildNodes[j]);
                }
              } else {
                console.log(
                  'Text Insertion: ',
                  childNode.nodeValue,
                  'in front of: ',
                  currChildNodes[j]
                );
                currEl.insertBefore(childNode, currChildNodes[j]);
              }
            }
          });
          //Attributes
          // Compare the attributes of the first and second elements
          for (let i = 0; i < newEl.attributes.length; i++) {
            const attributeName = newEl.attributes[i].name;
            if (attributeName === 'fdprocessedid') return;
            const attributeValue1 = newEl.getAttribute(attributeName);
            const attributeValue2 = currEl.getAttribute(attributeName);

            // Update the attribute value of the second element to match the first
            if (attributeValue1 !== attributeValue2) {
              //Log the Update
              console.log(
                'Attribute to be Updated  ',
                attributeName,
                ': ',
                attributeValue1
              );
              currEl.setAttribute(attributeName, attributeValue1);
            }
          }

          // Remove extra attributes from the second element
          for (let i = 0; i < currEl.attributes.length; i++) {
            const attributeName = currEl.attributes[i].name;
            if (attributeName === 'fdprocessedid') return;
            if (!newEl.hasAttribute(attributeName)) {
              // Check if the attribute exists in the first element
              console.log('Attribute to be Removed  ', attributeName);
              currEl.removeAttribute(attributeName);
            }
          }
        } else {
          console.log('Element to be Updated');
          console.log(
            'New Element: ',
            newEl.cloneNode(true),
            '  |  ',
            'Curr Element: ',
            currEl.cloneNode(true)
          );
          //Reached the element that needs updating
          if (newEl.textContent.trim() !== '') {
            currEl.textContent = newEl.textContent;
          }

          //Update Attributes
          Array.from(newEl.attributes).forEach(attr =>
            currEl.setAttribute(attr.name, attr.value)
          );
        }
      }
    };

    newElements.forEach((newParent, i) => {
      const currParent = currElements[i];
      //Initial Load
      traverseChanges(currParent, newParent);
    });
  }

  //Reset parent Container
  _clear() {
    this._parentElement.innerHTML = '';
  }

  //Loading Animation
  renderSpinner() {
    const markup = `<div class="spinner"><svg><use href="${icons}#icon-loader"></use></svg></div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Handle Loading and Hash Change Events
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  //Error Message Display
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
        <div>
          <svg>
              <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Success Message Display
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
        <div>
          <svg>
              <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
