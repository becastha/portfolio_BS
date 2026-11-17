import { LoadableViewModel } from '../../../shared/mvvm/loadable-viewmodel.js';
import { loadSkills } from '../model/skills-repository.js';

export class SkillsViewModel extends LoadableViewModel {
    constructor(loadData = loadSkills) {
        super(loadData);
    }
}
