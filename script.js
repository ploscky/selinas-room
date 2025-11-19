import content from '/content.json' with { type: 'json' };


// Adds in content from json file
function addContent() {
    document.getElementById('header-title').innerHTML = content['title'];
}


// Opens modal and resets its scroll
function openContent() {
    document.getElementById('display').style.display = 'block';
    document.getElementById('content').scrollTop = 0;

    return;
}


// Randomly selects message to display
function randomMessage() {
    const min = 0;
    const max = content['about']['message-variants'].length - 1;

    const random = Math.floor(Math.random() * (max - min + 1)) + min;

    return content['about']['message-variants'][random];
}


// Splits text into paragraphs along newlines
function formatText(str) {
    const textSplit = str.split('\n');
    let text = '';

    for (let i = 0; i < textSplit.length; i++) {
        text += `<p>${textSplit[i]}</p>`;
    }

    return text;
}


// Opens About modal
function openAbout() {
    openContent();

    const about = content['about'];
    document.getElementById('content').innerHTML =
        `<h1>${about.title}</h1>
        <div class='inline'>
            <img src='${about.img}'>
            <div>${formatText(about.desc)}
                <hr>
            <b>${about.message}:</b> <p>${randomMessage()}</p>
            </div>
        </div>`;
}


// Opens Projects modal
function openProjects() {
    openContent();
    document.getElementById('content').innerHTML = `<h1>Projects</h1>`;

    // Loop through all projects in json
    const projects = content['projects'];
    for (let i = 0; i < projects.length; i++) {

        const proj = projects[i];
        let links = '';

        // Loop through all links for project
        for (let j = 0; j < proj.links.length; j += 2) {
            if (j) links += ' / ';
            links += `<a href='${proj.links[j + 1]}'>${proj.links[j]}</a>`;
        }

        const div = document.createElement('div');
        div.classList.add('inline');

        div.innerHTML += `<img src='${proj.img}'>`;
        div.innerHTML +=
            `<div>
                <h2>${proj.title}</h2>
                <div class='project-links'>
                    ${links}
                    </div>
                <p>${formatText(proj.desc)}</p>

            </div>`;

        document.getElementById('content').appendChild(div);

        // Add horizontal line between projects
        if (i != projects.length - 1) document.getElementById('content').innerHTML += `<hr>`;
    }
}


function openResume() {
    window.open(content['resume'], '_blank');
}


function openLinks() {
    console.log('hoi');
    const links = content['links'];

    let contact = '';

    for (let i = 0; i < links.contact.length; i += 2) {
        contact += `${links.contact[i]} <p style='display: inline'> ${links.contact[i + 1]}</p><br>`;
    }

    openContent();
    document.getElementById('content').innerHTML =
        `<h1>Links</h1>
            <div class='link-icons'>
                <a href='${links.github}' target='_blank'><div class='github link-icon'></div></a>
                <a href='${links.linkedin}' target='_blank'><div class='linkedin link-icon'></div></a>
                <a href='${links.spotify}' target='_blank'><div class='spotify link-icon'></div></a>
                <a href='${links.goodreads}' target='_blank'><div class='goodreads link-icon'></div></a>
            </div>
            <h2>${links['contact-title']}</h2>${contact}
            <h2>designed with &lt;3</h2>
            <a href='https://mn1ca.fish' target='_blank'><img src='/img/sitely/mn1ca.gif' style='image-rendering: pixelated'></a>`;
}


// Adds mouseover, mouseout, and click functions to menu options
function menuInteractions() {

    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'light');

    const scene = document.getElementById('scene');
    const img = document.getElementById('img');

    let transitionLock = false; // prevents new transitions

    const menuItems = [
        {name: 'about', transform: 'scale(1.75) translate(-20%, -5%)', func: openAbout},
        {name: 'projects', transform: 'scale(2) translate(15%, -10%)', func: openProjects},
        {name: 'resume', transform: 'scale(2) translate(10%, 20%)', func: openResume},
        {name: 'links', transform: 'scale(2.5) translate(30%, -30%)', func: openLinks},
        {name: 'mode', transform: 'scale(1.75) translate(-21%, 30%)', func: mode},
    ];

    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];

        document.getElementById(item.name).addEventListener('mouseover', () => {
             if (transitionLock) return;

            setTimeout( () => {

            transitionLock = true;
            setTimeout(() => {transitionLock = false;}, 100);

            document.getElementById('scene').style.transform = item.transform;
            document.getElementById('img').style.opacity = .5;
            document.getElementById(`${item.name}-effect`).style.opacity = 1;
            }, 100);

        });

        function clear() {
            document.getElementById('scene').style.transform = 'scale(1) translate(0,0)';

            document.getElementById('img').style.opacity = 1;

            const effects = document.querySelectorAll('.effect');
            // You can iterate over the NodeList
            effects.forEach(e => {
              e.style.opacity = 0;
            });
        }

        document.getElementById('img').addEventListener('mouseover', clear);
        document.getElementById('menu').addEventListener('mouseover', clear);
        document.getElementById(item.name).addEventListener('mouseout', clear);

        if (item.func) {
            document.getElementById(item.name).onclick = item.func;
        }
    }

}


var currentMode = 'light';
var start = true;

// Change between light and dark mode
function mode() {
    // https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f

    if (start) {
        // Set default mode depending on time of day
        start = false;

        const now = new Date();
        const hours = now.getHours();
        console.log(hours);

        currentMode = (6 <= hours && hours <= 18) ? 'light' : 'dark';

    } else {
        currentMode = currentMode == 'light' ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', currentMode);

    return;
}


// Fade out preloader
function closePreloader() {
    const pre = document.getElementById('preloader');
    pre.style.transition = '1s';
    pre.style.opacity = 0;
    pre.style.pointerEvents = 'none';
}



window.onload = () => { menuInteractions();
    addContent();
    closePreloader();
    mode(1);
};
