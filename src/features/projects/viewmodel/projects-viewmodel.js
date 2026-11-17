import { LoadableViewModel } from '../../../shared/mvvm/loadable-viewmodel.js';
import { loadProjects } from '../model/projects-repository.js';

export class ProjectsViewModel extends LoadableViewModel {
    constructor(loadData = loadProjects) {
        super(loadData);
    }
}
