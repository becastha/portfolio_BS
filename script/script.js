// function toggleBlink(){
//     var nameElement = document.getElementById(`blinking-name`);
//     nameElement.classList.toggle('hidden');
// }setInterval(toggleBlink,500);


function typeEffect(element,speed){
    let text = element.innerHTML;
    element.innerHTML="";
    
    let i= 0;
    let timer = setInterval(function(){
        if(i<text.length){
            element.append(text.charAt(i));
            i++;
        }else{
            clearInterval(timer);
        }
    },speed);
}
const nameElement = document.getElementById('blinking-name');
typeEffect(nameElement,200);

document.addEventListener('DOMContentLoaded', function() {
    fetch('./data/project.json')
        .then(response => response.json())
        .then(projects => {
            displayProject(projects.slice(0, 3), true); 
            
            let displayedProjectCount = 3;

            document.getElementById('loadMore').addEventListener('click', function() {
                if (this.textContent === 'See More') {
                    displayProject(projects.slice(displayedProjectCount), true);
                    displayedProjectCount = projects.length;
                    this.textContent = 'See Less';
                } else {
                    displayProject(projects.slice(0, 3), false);
                    displayedProjectCount = 3;
                    this.textContent = 'See More';
                }
            });
        });
});

function displayProject(projects, append) {
    const container = document.querySelector('.projects-container');
    if (!append) {
        container.innerHTML = ''; 
    }

    projects.forEach(project => {
        const projectElement = `
            <article class="mb-3 project-item">
                <div class="year">${project.year}</div>
                <h4 class="card-text">${project.title}</h4>
                <p class="card-text">${project.role}</p>
                <p class="card-text">Languages and Tools used: ${project.technologies}</p>
                <p class="card-text">Team member: ${project.teamSize}</p>
                <p class="card-text">Project Description: ${project.description}</p>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', projectElement);
    });
}

// skill viewer
document.addEventListener('DOMContentLoaded', function () {
    fetch('./data/skills.json')
        .then(response => response.json())
        .then(skills => {
            var skillsContainer = document.querySelector('#skills .card-body .card-title'); // Define the container

            for (var skill in skills) {
                var normalizedSkill = skill.replace(/\W/g, '');
                var skillLevel = (skills[skill] === "Beginner") ? 1 : (skills[skill] === "Intermediate") ? 2 : 3;
        
                var skillDiv = document.createElement('h4');
                skillDiv.className = 'skill';
        
                var label = document.createElement('label');
                label.htmlFor = normalizedSkill;
                label.textContent = skill;
        
                var input = document.createElement('input');
                input.type = 'range';
                input.id = normalizedSkill;
                input.min = '1';
                input.max = '3';
                input.value = skillLevel;
        
                skillDiv.appendChild(label);
                skillDiv.appendChild(input);
        
                skillsContainer.appendChild(skillDiv);
            }
        })
        .catch(error => console.log('Error loading the skills data:', error));
});

//working-experience viewer
document.addEventListener('DOMContentLoaded', function() {
    fetch('./data/working_experience.json')
        .then(response => response.json())
        .then(workingExperiences => {
            const container = document.querySelector('.experience-container');
            workingExperiences.forEach(experience => {
                const experienceElement = `
                    <div class="mb-3 experience-item">
                        <h4>${experience.year}</h4>
                        <p><strong>Company:</strong> ${experience.office_name}</p>
                        <p><strong>Role:</strong> ${experience.role}</p>
                        <p><strong>Environment:</strong> ${experience.Environment}</p>
                        <p><strong>Team Size:</strong> ${experience['Total member']}</p>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', experienceElement);
            });
        })
        .catch(error => console.error('Error loading working experiences:', error));
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('./data/language.json')
        .then(response => response.json())
        .then(languages => {
            const container = document.querySelector('.language-container');
            languages.forEach(language => {
                const languageElement = `
                    <p>${language.language} - ${language.proficiency}</p>
                `;
                container.insertAdjacentHTML('beforeend', languageElement);
            });
        })
        .catch(error => console.error('Error loading languages:', error));
});


document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const themeToggleButton = document.createElement('button');
    themeToggleButton.textContent = 'Go DARK';
    themeToggleButton.id = 'theme-toggle';
    document.body.appendChild(themeToggleButton);

    // Handle theme toggle
    themeToggleButton.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.style.cursor = 'default';
        } else {
            document.body.classList.add('dark-theme');
            document.body.style.cursor = 'url("path_to_your_torch_cursor.png"), auto';
        }
    });

    // Handle section click
    document.querySelectorAll('section').forEach(section => {
        section.addEventListener('click', (event) => {
            event.stopPropagation();
            document.querySelectorAll('section').forEach(s => s.style.opacity = '0');
            section.style.opacity = '1';
        });
    });

    // Reset on body click
    document.body.addEventListener('click', () => {
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '1';
        });
    });
});