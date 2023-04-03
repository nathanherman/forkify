//Search View Dom Controller
class SearchView {
  _parentEl = document.querySelector('.search');

  //Get Input Value from Search Form
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  //Clear Input Value
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  //Handle Submit Events
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
