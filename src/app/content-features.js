// The content features: each loads one resource and renders it into its container on the page.
// Shared by every entry point, whatever the page around the containers looks like.

import { EducationView } from '../features/education/view/education-view.js';
import { EducationViewModel } from '../features/education/viewmodel/education-viewmodel.js';
import { ExperienceView } from '../features/experience/view/experience-view.js';
import { ExperienceViewModel } from '../features/experience/viewmodel/experience-viewmodel.js';
import { LanguagesView } from '../features/languages/view/languages-view.js';
import { LanguagesViewModel } from '../features/languages/viewmodel/languages-viewmodel.js';
import { OverviewView } from '../features/overview/view/overview-view.js';
import { OverviewViewModel } from '../features/overview/viewmodel/overview-viewmodel.js';
import { ProfileView } from '../features/profile/view/profile-view.js';
import { ProfileViewModel } from '../features/profile/viewmodel/profile-viewmodel.js';
import { ProjectsView } from '../features/projects/view/projects-view.js';
import { ProjectsViewModel } from '../features/projects/viewmodel/projects-viewmodel.js';
import { SkillsView } from '../features/skills/view/skills-view.js';
import { SkillsViewModel } from '../features/skills/viewmodel/skills-viewmodel.js';

const CONTENT_FEATURES = Object.freeze([
    [ProfileViewModel, ProfileView],
    [OverviewViewModel, OverviewView],
    [ProjectsViewModel, ProjectsView],
    [SkillsViewModel, SkillsView],
    [ExperienceViewModel, ExperienceView],
    [EducationViewModel, EducationView],
    [LanguagesViewModel, LanguagesView],
]);

/** Call once the containers are in the page. */
export function startContentFeatures() {
    CONTENT_FEATURES.forEach(([ViewModel, View]) => {
        const viewModel = new ViewModel();
        new View(viewModel).start();
        viewModel.load();
    });
}
