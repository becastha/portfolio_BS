import { LoadableViewModel } from '../../../shared/mvvm/loadable-viewmodel.js';
import { loadExperience } from '../model/experience-repository.js';

export class ExperienceViewModel extends LoadableViewModel {
    constructor(loadData = loadExperience) {
        super(loadData);
    }
}
