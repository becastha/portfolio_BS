import { LoadableViewModel } from '../../../shared/mvvm/loadable-viewmodel.js';
import { loadProfile } from '../model/profile-repository.js';

export class ProfileViewModel extends LoadableViewModel {
    constructor(loadData = loadProfile) {
        super(loadData);
    }
}
