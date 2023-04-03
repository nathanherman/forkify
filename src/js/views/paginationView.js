//Parent Class
import View from './View';

//Assets
import icons from 'url:../../img/icons.svg';

//Pagination View DOM Controller
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const GoTo = Number(btn.dataset.goto);
      handler(GoTo);
    });
  }

  _generateMarkup() {
    //Get the total number of Pages for a recipe query
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Get the current page of the results. Default 1
    const currentPage = this._data.page;

    //Pagination Scenarios

    //Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      //Render Next Button
      return this._generateButtonMarkup(currentPage, 'next');
    }

    //Page 1, and NO other pages.
    if (currentPage === 1 && numPages === 1) {
      //Render Nothing
      return '';
    }

    //Last Page
    if (currentPage === numPages && currentPage > 1) {
      //Render Previous Button
      return this._generateButtonMarkup(currentPage, 'prev');
    }

    //In between the first and last page
    if (currentPage < numPages && currentPage > 1) {
      //Render Next & Previous Button
      return (
        this._generateButtonMarkup(currentPage, 'next') +
        this._generateButtonMarkup(currentPage, 'prev')
      );
    }
  }

  _generateButtonMarkup(page, type = 'next') {
    if (type === 'next') {
      return `<button class="btn--inline pagination__btn--next" data-goto="${
        page + 1
      }">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
            </button>`;
    } else if (type === 'prev') {
      return `<button class="btn--inline pagination__btn--prev" data-goto="${
        page - 1
      }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
            </button>`;
    } else {
      return '';
    }
  }
}

export default new PaginationView();
