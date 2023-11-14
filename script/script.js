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

document.addEventListener('DOMContentLoaded', function () {
    fetch('./data/skills.json')
        .then(response => response.json())
        .then(skills => {
            var skillsContainer = document.querySelector('#skills .card-body .card-title'); // Define the container

            for (var skill in skills) {
                var normalizedSkill = skill.replace(/\W/g, '');
                var skillLevel = (skills[skill] === "Beginner") ? 1 : (skills[skill] === "Intermediate") ? 2 : 3;
        
                var skillDiv = document.createElement('div');
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
