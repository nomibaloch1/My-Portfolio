// ===== THEME: DARK / LIGHT =====
const themeButton = document.getElementById("theme-toggle");
let savedTheme = null;
try { savedTheme = localStorage.getItem("portfolio-theme"); } catch (error) { /* storage may be unavailable */ }
if (savedTheme === "light") document.body.classList.add("light-theme");
function updateThemeButton() {
  if (!themeButton) return;
  const isLight = document.body.classList.contains("light-theme");
  themeButton.textContent = isLight ? "🌙" : "☀️";
  themeButton.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
}
updateThemeButton();
if (themeButton) themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  try { localStorage.setItem("portfolio-theme", isLight ? "light" : "dark"); } catch (error) { /* ignore storage errors */ }
  updateThemeButton();
});

// ===== TYPING ANIMATION =====
const typingElement = document.getElementById("typing-text");
const roles = ["IT Student", "Aspiring Developer", "Creative Learner"];
let roleIndex = 0, characterIndex = 0, deleting = false;
function typeRole() {
  if (!typingElement) return;
  const currentRole = roles[roleIndex];
  characterIndex += deleting ? -1 : 1;
  typingElement.textContent = currentRole.substring(0, characterIndex);
  let delay = deleting ? 55 : 100;
  if (!deleting && characterIndex === currentRole.length) { deleting = true; delay = 1300; }
  else if (deleting && characterIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
  setTimeout(typeRole, delay);
}
if (typingElement && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) typeRole();
else if (typingElement) typingElement.textContent = roles[0];

// ===== ANIMATED SKILL BARS =====
const skillBars = document.querySelectorAll(".skill-progress");
function showSkillBars() {
  skillBars.forEach((bar) => {
    const level = Number(bar.dataset.level);
    if (Number.isFinite(level) && level >= 0 && level <= 100) bar.style.width = level + "%";
  });
}
if ("IntersectionObserver" in window) {
  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { showSkillBars(); skillsObserver.disconnect(); }
    }, { threshold: 0.2 });
    skillsObserver.observe(skillsSection);
  }
} else showSkillBars();

// ===== SEPARATE SECTION VIEWS =====
const pageViews = [...document.querySelectorAll("[data-page]")];
const navLinks = [...document.querySelectorAll(".nav-link")];
function openView(viewName, scrollTarget = null, updateHash = true) {
  const validView = pageViews.some((view) => view.dataset.page === viewName);
  if (!validView) viewName = "home";
  pageViews.forEach((view) => {
    const isActive = view.dataset.page === viewName;
    view.hidden = !isActive;
    view.classList.toggle("active", isActive);
  });
  navLinks.forEach((link) => {
    const isActive = link.dataset.view === viewName && (!link.dataset.scroll || link.dataset.scroll === scrollTarget);
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (updateHash) {
    const hash = scrollTarget ? `#${scrollTarget}` : `#${viewName}`;
    if (window.location.hash !== hash) history.pushState({ viewName, scrollTarget }, "", hash);
  }
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  if (scrollTarget) {
    requestAnimationFrame(() => {
      const target = document.getElementById(scrollTarget);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}
document.querySelectorAll("[data-view]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const viewName = link.dataset.view;
    if (!viewName) return;
    event.preventDefault();
    openView(viewName, link.dataset.scroll || null, true);
  });
});
function syncViewFromHash() {
  const hash = window.location.hash.slice(1);
  const sectionToView = { home: "home", about: "home", skills: "home", education: "home", projects: "projects", adventures: "adventures", movies: "movies", interests: "interests", quotes: "quotes", contact: "contact" };
  const viewName = sectionToView[hash] || "home";
  const scrollTarget = ["about", "skills", "education"].includes(hash) ? hash : null;
  openView(viewName, scrollTarget, false);
}
window.addEventListener("popstate", syncViewFromHash);
window.addEventListener("hashchange", syncViewFromHash);
// Initial state: show only the profile unless a valid section hash is present.
syncViewFromHash();

// ===== MOVIES / SERIES FILTER =====
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const movieCards = [...document.querySelectorAll(".movie-card")];
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;
    filterButtons.forEach((btn) => {
      const active = btn === button;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    movieCards.forEach((card) => {
      card.hidden = !(selectedCategory === "all" || card.dataset.category === selectedCategory);
    });
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
if (contactForm) contactForm.addEventListener("submit", (event) => {
  const formAction = contactForm.getAttribute("action");
  if (!formAction || formAction.includes("YOUR_FORM_ID")) {
    event.preventDefault();
    if (formStatus) formStatus.textContent = "Form design is ready. Connect your Formspree form ID to send messages.";
  }
});

// ===== AUTOMATIC COPYRIGHT YEAR =====
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();
