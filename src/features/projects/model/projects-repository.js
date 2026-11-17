// Loads the project list.

import { fetchJson } from '../../../shared/data/http.js';
import { PROJECTS_DATA_URL } from '../projects-constants.js';

/**
 * @typedef {{ year: string, title: string, role: string, technologies: string, teamSize: string, description: string }} Project
 */

/** @returns {Promise<Project[]>} */
export async function loadProjects() {
    const raw = await fetchJson(PROJECTS_DATA_URL);
    return raw.map(project => ({
        year: project.year,
        title: project.title,
        role: project.role,
        technologies: project.technologies,
        teamSize: project.teamSize,
        description: project.description ?? '',
    }));
}
