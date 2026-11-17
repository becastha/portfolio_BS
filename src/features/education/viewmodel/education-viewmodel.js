import { LoadableViewModel } from '../../../shared/mvvm/loadable-viewmodel.js';
import { loadEducation } from '../model/education-repository.js';

export class EducationViewModel extends LoadableViewModel {
    constructor(loadData = loadEducation) {
        super(loadData);
    }
}
