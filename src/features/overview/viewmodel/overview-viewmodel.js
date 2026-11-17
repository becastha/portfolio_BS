import { LoadableViewModel } from '../../../shared/mvvm/loadable-viewmodel.js';
import { loadOverview } from '../model/overview-repository.js';

export class OverviewViewModel extends LoadableViewModel {
    constructor(loadData = loadOverview) {
        super(loadData);
    }
}
