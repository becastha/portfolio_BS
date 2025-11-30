// ============= DATA LOADING =============

function initData() {
    loadProjects();
    loadSkills();
    loadExperience();
    loadLanguages();
}

// ============= PROJECTS =============

function loadProjects() {
    fetch('./data/project.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load projects');
            return response.json();
        })
        .then(projects => {
            const container = document.getElementById('projects-container');
            container.innerHTML = '';
            projects.forEach(project => {
                container.appendChild(createProjectCard(project));
            });
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            document.getElementById('projects-container').innerHTML = '<p style="color: #999;">Unable to load projects</p>';
        });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <span class="project-year">${project.year}</span>
        <h3>${project.title}</h3>
        <p><strong>Role:</strong> ${project.role}</p>
        <p><strong>Tech:</strong> ${project.technologies}</p>
        <p><strong>Team:</strong> ${project.teamSize}</p>
        <p>${project.description}</p>
    `;
    return card;
}

// ============= SKILLS =============

function loadSkills() {
    fetch('./data/skills.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load skills');
            return response.json();
        })
        .then(skills => {
            const container = document.getElementById('skills-container');
            container.innerHTML = '';
            for (const [skill, level] of Object.entries(skills)) {
                container.appendChild(createSkillItem(skill, level));
            }
        })
        .catch(error => {
            console.error('Error loading skills:', error);
            document.getElementById('skills-container').innerHTML = '<p style="color: #999;">Unable to load skills</p>';
        });
}

function createSkillItem(skill, level) {
    const item = document.createElement('div');
    item.className = 'skill-item';
    const levelClass = level === 'Beginner' ? 'beginner' : level === 'Intermediate' ? 'intermediate' : 'pro';
    item.innerHTML = `
        <span class="skill-name">${skill}</span>
        <span class="skill-level ${levelClass}"></span>
    `;
    return item;
}

// ============= EXPERIENCE =============

function loadExperience() {
    fetch('./data/working_experience.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load experience');
            return response.json();
        })
        .then(experiences => {
            const container = document.getElementById('experience-container');
            container.innerHTML = '';
            experiences.forEach(exp => {
                container.appendChild(createExpCard(exp));
            });
        })
        .catch(error => {
            console.error('Error loading experience:', error);
            document.getElementById('experience-container').innerHTML = '<p style="color: #999;">Unable to load experience</p>';
        });
}

function createExpCard(exp) {
    const card = document.createElement('div');
    card.className = 'exp-card';
    card.innerHTML = `
        <span class="exp-year">${exp.year}</span>
        <h3>${exp.office_name}</h3>
        <p><strong>Role:</strong> ${exp.role}</p>
        <p><strong>Environment:</strong> ${exp.Environment}</p>
        <p><strong>Team:</strong> ${exp['Total member']}</p>
    `;
    return card;
}

// ============= LANGUAGES =============

function loadLanguages() {
    fetch('./data/language.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load languages');
            return response.json();
        })
        .then(languages => {
            const container = document.getElementById('languages-container');
            container.innerHTML = '';
            languages.forEach(lang => {
                container.appendChild(createLangItem(lang));
            });
        })
        .catch(error => {
            console.error('Error loading languages:', error);
            document.getElementById('languages-container').innerHTML = '<p style="color: #999;">Unable to load languages</p>';
        });
}

function createLangItem(lang) {
    const item = document.createElement('div');
    item.className = 'lang-item';
    item.innerHTML = `
        <span class="lang-name">${lang.language}</span>
        <span class="lang-prof">${lang.proficiency}</span>
    `;
    return item;
}