// =========================================================
//  - SCRIPT.JS
// 1. Theme   2. Typing   3. Skill bars   4. Pages
// 5. Movie filter   6. Contact form   7. Year
// =========================================================


// ===== 1. DARK / LIGHT THEME =====
const themeButton = document.getElementById("theme-toggle");

// When the page opens, check if the visitor saved the light theme before
if (localStorage.getItem("portfolio-theme") === "light") {
  document.body.classList.add("light-theme");
}

// Show the moon in light mode and the sun in dark mode
function updateThemeButton() {
  if (document.body.classList.contains("light-theme")) {
    themeButton.textContent = "🌙";
  } else {
    themeButton.textContent = "☀️";
  }
}
updateThemeButton();

themeButton.addEventListener("click", function () {
  document.body.classList.toggle("light-theme");

  // Save the choice so it stays after refresh
  if (document.body.classList.contains("light-theme")) {
    localStorage.setItem("portfolio-theme", "light");
  } else {
    localStorage.setItem("portfolio-theme", "dark");
  }

  updateThemeButton();
});


// ===== 2. TYPING ANIMATION =====
const typingText = document.getElementById("typing-text");
const roles = ["IT Student", "Aspiring Developer", "Creative Learner"];

let roleNumber = 0;      // which role is being typed
let letterNumber = 0;    // how many letters are visible
let isDeleting = false;  // true while letters are being removed

function typeEffect() {
  const currentRole = roles[roleNumber];

  // Add one letter, or remove one letter
  if (isDeleting) {
    letterNumber = letterNumber - 1;
  } else {
    letterNumber = letterNumber + 1;
  }

  typingText.textContent = currentRole.substring(0, letterNumber);

  // Typing speed (in milliseconds)
  let speed = 100;
  if (isDeleting) {
    speed = 55;
  }

  if (isDeleting === false && letterNumber === currentRole.length) {
    // Full word typed: wait, then start deleting
    isDeleting = true;
    speed = 1300;
  } else if (isDeleting && letterNumber === 0) {
    // Word deleted: move to the next role
    isDeleting = false;
    roleNumber = roleNumber + 1;
    if (roleNumber === roles.length) {
      roleNumber = 0;
    }
    speed = 350;
  }

  setTimeout(typeEffect, speed);
}
typeEffect();


// ===== 3. SKILL BARS (fill when the Skills section comes on screen) =====
const skillsSection = document.getElementById("skills");
const skillBars = document.querySelectorAll(".skill-progress");
let skillsShown = false;

function showSkillBars() {
  if (skillsShown) {
    return;
  }

  // If another page is open, the Skills section is hidden, so do nothing
  if (skillsSection.offsetHeight === 0) {
    return;
  }

  // Distance of the Skills section from the top of the screen
  const distance = skillsSection.getBoundingClientRect().top;

  if (distance < window.innerHeight - 100) {
    for (let i = 0; i < skillBars.length; i++) {
      skillBars[i].style.width = skillBars[i].dataset.level + "%";
    }
    skillsShown = true;
  }
}

window.addEventListener("scroll", showSkillBars);
showSkillBars();


// ===== 4. SHOW ONE PAGE AT A TIME =====
// The link (#projects, #contact ...) decides which page opens.
const pages = document.querySelectorAll(".page-view");
const navLinks = document.querySelectorAll(".nav-link");

// Which page does each link name belong to?
const pageOfHash = {
  home: "home",
  about: "home",
  skills: "home",
  education: "home",
  projects: "projects",
  adventures: "adventures",
  movies: "movies",
  interests: "interests",
  quotes: "quotes",
  contact: "contact"
};

function showPage() {
  // "#about" becomes "about"
  let hash = window.location.hash.slice(1);

  // Empty or unknown link: open the home page
  if (pageOfHash[hash] === undefined) {
    hash = "home";
  }

  // Show the chosen page and hide the others
  for (let i = 0; i < pages.length; i++) {
    pages[i].hidden = pages[i].id !== "view-" + pageOfHash[hash];
  }

  // Highlight the matching menu link
  for (let i = 0; i < navLinks.length; i++) {
    if (navLinks[i].getAttribute("href") === "#" + hash) {
      navLinks[i].classList.add("active");
    } else {
      navLinks[i].classList.remove("active");
    }
  }

  // Scroll: to the section on the home page, otherwise to the top
  if (hash === "about" || hash === "skills" || hash === "education") {
    document.getElementById(hash).scrollIntoView();
  } else {
    window.scrollTo(0, 0);
  }

  showSkillBars();
}

// Run when the site opens, and every time the link changes
window.addEventListener("hashchange", showPage);
showPage();


// ===== 5. MOVIES / SERIES FILTER =====
const filterButtons = document.querySelectorAll(".filter-btn");
const movieCards = document.querySelectorAll(".movie-card");

// Show only the cards of the chosen category ("all", "movie" or "series")
function filterMovies(category) {
  for (let i = 0; i < movieCards.length; i++) {
    if (category === "all" || movieCards[i].dataset.category === category) {
      movieCards[i].hidden = false;
    } else {
      movieCards[i].hidden = true;
    }
  }
}

for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener("click", function () {
    // Remove "active" from all buttons, then add it to the clicked one
    for (let j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove("active");
    }
    filterButtons[i].classList.add("active");

    filterMovies(filterButtons[i].dataset.filter);
  });
}


// ===== 6. CONTACT FORM =====
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", function (event) {
  const formAction = contactForm.getAttribute("action");

  // The Formspree ID is not added yet, so do not send the form
  if (formAction.includes("YOUR_FORM_ID")) {
    event.preventDefault();
    formStatus.textContent = "Form design is ready. Connect your Formspree form ID to send messages.";
  }
});


// ===== 7. AUTOMATIC COPYRIGHT YEAR =====
document.getElementById("year").textContent = new Date().getFullYear();
