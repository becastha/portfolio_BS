import { LoadableViewModel } from '../../../shared/mvvm/loadable-viewmodel.js';
import { loadLanguages } from '../model/languages-repository.js';

export class LanguagesViewModel extends LoadableViewModel {
    constructor(loadData = loadLanguages) {
        super(loadData);
    }
}
