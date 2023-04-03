//Parent Class
import View from './View';
import previewView from './previewView';

//Assets
import icons from 'url:../../img/icons.svg';

//Results View DOM Controller
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found under that search. Please try again :)`;
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
