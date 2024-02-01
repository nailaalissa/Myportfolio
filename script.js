const menu = document.querySelector('.menu');
const menuItems = document.querySelectorAll('.menuItem');
const hamburger = document.querySelector('.hamburger');
const closeIcon = document.querySelector('.closeIcon');
const menuIcon = document.querySelector('.menuIcon');
const loginForm = document.getElementById('loginForm');
const username = 'nailaalissa';
const token = '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';
let cardsection = document.getElementById('cardselection');
let cssButton = document.getElementById('CSS');
let AllButton = document.getElementById('all');
let JavaScriptButton = document.getElementById('JavaScript');
let CSharpButton = document.getElementById('C#');
let htmlButton = document.getElementById('html');
let originalData = [];
let numberOfProjects = 0;
const loginBtn = document.getElementById('loginBtn');
const adminBtn = document.getElementById('adminbtn');
const adminPanel = document.getElementById('adminPanel');
const closePanelBtn = document.getElementById('close');
const applyChangesBtn = document.getElementById('applyChanges');
const resetStylesBtn = document.getElementById('resetStylesBtn');
const userInputRepoName = document.getElementById('reponame');
const createRepo = document.getElementById('createRepo');
const description = document.getElementById('description');
const visibilitySelect = document.getElementById('visibility');
const createnewBtn = document.getElementById('createnew');
const reponameDiv = document.querySelector('.repo');
const createRepoBtn = document.getElementById('createRepo');
// Hide the close icon initially
closeIcon.style.display = 'none';
// // Initially hide the repo input div
reponameDiv.style.display = 'none';

// Initial display of projects
displayProjects();
// ///////////Event listeners ////////////////////
hamburger.addEventListener('click', toggleMenu);
menuItems.forEach((menuItem) => menuItem.addEventListener('click', toggleMenu));
cssButton.addEventListener('click', () => filterProjects('css'));
AllButton.addEventListener('click', () => displayProjects());
htmlButton.addEventListener('click', () => filterProjects('html'));
JavaScriptButton.addEventListener('click', () => filterProjects('javascript'));
CSharpButton.addEventListener('click', () => filterProjects('C#'));
adminBtn.addEventListener('click', login);
createRepo.addEventListener('click', handleCreateRepo);
applyChangesBtn.addEventListener('click', applyChanges);
resetStylesBtn.addEventListener('click', resetStyles);
// Event listener for "Create new Repo" button
createnewBtn.addEventListener('click', function () {
  // Toggle the visibility of the repo input div
  if (reponameDiv.style.display === 'none') {
    reponameDiv.style.display = 'block';
    createnewBtn.textContent = '✖';
    createnewBtn.style.float = 'right';
    // createnewBtn.style.padding = '0 5px';
    createnewBtn.style.borderRadius = '50%';
  } else {
    reponameDiv.style.display = 'none';
    createnewBtn.textContent = 'Create new Repo';
    createnewBtn.style.float = 'left';
    createnewBtn.style.borderRadius = 'initial';
  }
});
hamburger.addEventListener('click', toggleMenu);
//////////////////Humburger Menu ///////////////
menuItems.forEach(function (menuItem) {
  menuItem.addEventListener('click', toggleMenu);
});

function toggleMenu() {
  if (menu.classList.contains('showMenu')) {
    menu.classList.remove('showMenu');
    closeIcon.style.display = 'none';
    menuIcon.style.display = 'block';
  } else {
    menu.classList.add('showMenu');
    closeIcon.style.display = 'block';
    menuIcon.style.display = 'none';
  }
}

//////////////////////////////////////////////Get API / Get all Repo in github///////////////////

// Function to fetch GitHub repositories
async function fetchRepositories() {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch repositories: ${response.statusText}`);
    }

    const data = await response.json();
    originalData = data;
    numberOfProjects = data.length;

    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function to filter projects by language
async function filterProjects(language) {
  const projects = await fetchRepositories();

  if (!projects) {
    console.log('Failed to fetch projects');
    return;
  }

  const filteredProjects = projects.filter((repo) => {
    const repoLanguage = repo.language ? repo.language.toLowerCase() : '';
    const targetLanguage = language.toLowerCase();

    return (
      repoLanguage.includes(targetLanguage) || (repoLanguage === '' && targetLanguage === 'all')
    );
  });

  displayProjects(filteredProjects);
}

// Function to fetch README content for a repository
async function fetchReadme(repoName) {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {}; // Return an empty object if the README file doesn't exist
      } else {
        throw new Error(
          `Failed to fetch README for repository ${repoName}: ${response.statusText}`,
        );
      }
    }

    const readmeData = await response.json();
    const readmeContent = atob(readmeData.content);

    const firstThreeLines = readmeContent.split('\n').slice(1, 4).join('\n');
    const firstLine = readmeContent.split('\n')[0];

    return { firstLine, firstThreeLines };
  } catch (error) {
    console.error(error);
    return null; // Return null if an error occurs
  }
}

// Function to check if an image exists asynchronously
async function doesImageExistAsync(imagePath) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function () {
      resolve(true);
    };
    img.onerror = function () {
      resolve(false);
    };
    img.src = imagePath;
  });
}

// Async function to set project image URL
async function setProjectImageAsync(projectName) {
  const imagePath = `./img/${projectName}.jpg`;

  if (!(await doesImageExistAsync(imagePath))) {
    return './img/default.jpg';
  }

  return imagePath;
}

// Function to display projects
async function displayProjects(projectsToShow) {
  const cardsection = document.getElementById('cardselection');
  const projects = projectsToShow || (await fetchRepositories());

  if (!projects) {
    console.log('Failed to fetch projects');
    return;
  }

  cardsection.innerHTML = '';

  for (const project of projects) {
    const { firstLine, firstThreeLines } = await fetchReadme(project.name);

    if (firstLine === 'No README found') {
      var displayFirstLine = 'No README available';
      var displayFirstThreeLines = '';
    } else {
      var displayFirstLine = firstLine || 'Default First Line';
      var displayFirstThreeLines = firstThreeLines || 'Default First Three Lines';
    }

    let card = document.createElement('article');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${await setProjectImageAsync(project.name)}" alt="${project.name} Image" />
      <div class="box">
        <div class="cardtext">
          <h1 class="cardtitle">${displayFirstLine}</h1>
          <p class="langcard">${project.language}</p>
          <p class="readme">${displayFirstThreeLines}</p>
        </div>
        <div class="cardicon">
          <div class="icon-hyperlink">
            <a href="${project.html_url}">
              <i class="fa-brands fa-square-github"></i>
            </a>
          </div>
          <div>
            <a class="link flex" href="${project.html_url}">
              more
              <span> -></span>
            </a>
          </div>
        </div>
      </div>
    `;

    cardsection.appendChild(card);
  }
}

////////////////////////////////////////Post API / Create new Repo ///////////////////////////

// Function to handle repository creation
async function handleCreateRepo() {
  if (userInputRepoName.value.trim() !== '') {
    await createRepository(userInputRepoName.value);
  } else {
    alert('Repository name cannot be empty.');
  }
}

// Function to create a GitHub repository
async function createRepository(repoName) {
  try {
    const response = await fetch(`https://api.github.com/user/repos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: repoName,
        description: description.value,
        private: visibilitySelect.value === 'private',
        has_issues: true,
        has_projects: true,
        has_wiki: true,
        language: 'Html',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create repository ${repoName}: ${response.statusText}`);
    }
    const rpodiv = document.getElementById('rpodiv');
    const repotext = document.createElement('p');
    repotext.classList.add(repotext);
    const responseData = await response.json();
    repotext.textContent = `Repository ${repoName} created successfully!`;
    rpodiv.appendChild(repotext);
    console.log(responseData);
  } catch (error) {
    const rpodiv = document.getElementById('rpodiv');
    const repotext = document.createElement('p');
    repotext.textContent = `Error creating repository ${repoName}. Check the console for details.`;
    rpodiv.appendChild(repotext);
  }
}

///////////////////////////////////////// Admin Section ///////////////////////////////////
// Function to toggle the login form
function toggleLoginForm() {
  const loginForm = document.getElementById('loginForm');
  loginForm.style.display =
    loginForm.style.display === 'none' || loginForm.style.display === '' ? 'block' : 'none';
}

// Function to handle login logic
function login() {
  const usernameInput = document.getElementById('username').value.toLowerCase();
  const passwordInput = document.getElementById('password').value.toLowerCase();

  if (usernameInput === 'naila' && passwordInput === '1234') {
    // console.log('Username:', usernameInput);
    // console.log('Password:', passwordInput);
    // console.log('Success');

    const adminPanel = document.getElementById('adminPanel');
    adminPanel.style.display = 'block';
    displayLastLogin();
    usernameInput.value = '';
    passwordInput.value = '';
    adminPanel.style.display = 'block';
    loginForm.style.display = 'none';
    loginBtn.textContent = 'Logout';
    toggleLoginForm();
  } else {
    alert('Invalid username or password');
  }
}

loginBtn.addEventListener('click', function () {
  const adminPanel = document.getElementById('adminPanel');
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn.textContent === 'Logout') {
    loginBtn.textContent = 'Login';
    loginForm.style.display = 'none';
    adminPanel.style.display = 'none';
  } else {
    toggleLoginForm();
  }
});

// Function to apply changes
function applyChanges() {
  const backgroundColor = document.getElementById('backgroundColor').value;
  const textColor = document.getElementById('textColor').value;
  const ProfileText = document.getElementById('text').value;
  const navColor = document.getElementById('navColor').value;

  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = textColor;
  document.getElementById('ProfileText').innerText = ProfileText;
  document.getElementById('navbar').style.backgroundColor = navColor;
}

// Function to apply changes
function applyChanges() {
  const backgroundColor = document.getElementById('backgroundColor').value;
  const textColor = document.getElementById('textColor').value;
  const ProfileText = document.getElementById('text').value;
  const navColor = document.getElementById('navColor').value;

  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = textColor;
  document.getElementById('ProfileText').innerText = ProfileText;
  document.getElementById('navbar').style.backgroundColor = navColor;
}

// Function to reset styles
function resetStyles() {
  document.getElementById('backgroundColor').value = '#ffffff';
  document.getElementById('textColor').value = 'rgb(13, 13, 14)';
  document.getElementById('text').textContent =
    "I'm a Frontend Web Developer, specializing in crafting visually appealing and user-friendly websites. A Computer Engineering graduate from Damascus University, I bring strong problem-solving skills and the ability to adapt quickly. Passionate about sharing knowledge, I regularly post valuable content on Web Development on my LinkedIn. Open to job opportunities, I am a communicative, innovative team player eager to contribute and grow. Let's connect and explore how I can bring my skills to your team ";
  document.getElementById('navbar').style.backgroundColor = '#293040';
  applyChanges();
}

// Function to display last login information
function displayLastLogin() {
  const lastLogin = localStorage.getItem('lastLogin');
  const lastLoginInfo = document.getElementById('lastLoginInfo');
  if (lastLogin) {
    lastLoginInfo.innerHTML = `
     <h1> Hi Admin</h1><br> your Last Login: ${lastLogin} <br>
      You have ${numberOfProjects} repositories in your GitHub Account
    `;

    lastLoginInfo.style.margin = '1rem';
  }
}

////////////////////////// Contact Form to Send message To my Email ////////////////
var form = document.getElementById('my-form');
const successMessage = document.getElementById('success-message');
const lottieContainer = document.getElementById('lottie-container'); // Add an ID to a container element

async function handleSubmit(event) {
  event.preventDefault();
  var status = document.getElementById('my-form-status');
  var data = new FormData(event.target);

  try {
    var response = await fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      status.innerHTML = 'Thanks. Your message has been sent successfully!';
      status.style.color = 'green';
      form.reset();

      // Hide the success message after 5 seconds (adjust as needed)
      setTimeout(function () {
        status.style.display = 'none';
      }, 5000);
    } else {
      var responseData = await response.json();
      if (Object.hasOwnProperty.call(responseData, 'errors')) {
        status.innerHTML = responseData.errors.map((error) => error.message).join(', ');
      } else {
        status.innerHTML = 'Oops! There was a problem submitting your form';
      }
    }
  } catch (error) {
    status.innerHTML = 'Oops! There was a problem submitting your form';
  }
}

form.addEventListener('submit', handleSubmit);
////////////////////////////////////////////////////////
