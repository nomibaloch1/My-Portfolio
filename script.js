

const pageButtons = document.querySelectorAll("[data-page]");
const pageViews = document.querySelectorAll(".page-view");
const navLinks = document.querySelectorAll(".nav-link[data-page]");
const menuButton = document.getElementById("menu-toggle");
const navPanel = document.getElementById("nav-panel");

function showPage(pageName, updateAddress) {
  const pageExists = document.getElementById("view-" + pageName);
  if (!pageExists) pageName = "home";

  pageViews.forEach(function (view) {
    const isSelected = view.dataset.view === pageName;
    view.classList.toggle("is-active", isSelected);
    view.setAttribute("aria-hidden", String(!isSelected));
  });

  navLinks.forEach(function (link) {
    const isSelected = link.dataset.page === pageName;
    link.classList.toggle("active", isSelected);
    link.setAttribute("aria-current", isSelected ? "page" : "false");
  });

  if (updateAddress) {
    history.pushState({ page: pageName }, "", "#" + pageName);
  }

  if (navPanel) navPanel.classList.remove("open");
  if (menuButton) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }

  const activeView = document.getElementById("view-" + pageName);
  activeView.querySelectorAll(".reveal").forEach(function (item) {
    item.classList.add("is-visible");
  });
  document.getElementById("page-main").focus({ preventScroll: true });
}

pageButtons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    showPage(button.dataset.page, true);
  });
});

// Internal text links also switch views without scrolling the whole document.
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (event) {
    const target = link.getAttribute("href").slice(1);
    if (document.getElementById("view-" + target)) {
      event.preventDefault();
      showPage(target, true);
    }
  });
});

window.addEventListener("popstate", function () {
  showPage(location.hash.replace("#", "") || "home", false);
});
window.addEventListener("load", function () {
  showPage(location.hash.replace("#", "") || "home", false);
});

// Mobile menu
if (menuButton && navPanel) {
  menuButton.addEventListener("click", function () {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navPanel.classList.toggle("open", !isOpen);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      navPanel.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }
  });
}

// Theme selection is remembered between visits.
const themeButton = document.getElementById("theme-toggle");
if (themeButton) {
  const themeIcon = themeButton.querySelector(".theme-icon");
  try {
    if (localStorage.getItem("noman-portfolio-theme") === "dark") document.body.classList.add("dark-theme");
  } catch (error) { /* Theme still works if browser storage is unavailable. */ }
  function updateThemeButton() {
    const darkOn = document.body.classList.contains("dark-theme");
    themeIcon.textContent = darkOn ? "☀" : "☾";
    themeButton.setAttribute("aria-label", darkOn ? "Switch to light theme" : "Switch to dark theme");
  }
  updateThemeButton();
  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");
    try { localStorage.setItem("noman-portfolio-theme", document.body.classList.contains("dark-theme") ? "dark" : "light"); }
    catch (error) { /* Theme still works for this visit. */ }
    updateThemeButton();
  });
}

// Reveal animations
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) {
  document.querySelectorAll(".page-view.is-active .reveal").forEach(function (item) {
    item.classList.add("is-visible");
  });
} else {
  document.querySelectorAll(".reveal").forEach(function (item) { item.classList.add("is-visible"); });
}

// Movie and series filters
const filterButtons = document.querySelectorAll(".filter-btn");
const movieCards = document.querySelectorAll(".movie-card");
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const category = button.dataset.filter;
    filterButtons.forEach(function (item) { item.classList.toggle("active", item === button); });
    movieCards.forEach(function (card) {
      card.hidden = !(category === "all" || card.dataset.category === category);
    });
  });
});

// Contact form opens WhatsApp with the visitor's prepared message.
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const formStatus = document.getElementById("form-status");
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const text = "Hello Noman, my name is " + name + ".\nEmail: " + email + "\nMessage: " + message;
    const url = "https://wa.me/923333147370?text=" + encodeURIComponent(text);
    if (formStatus) formStatus.textContent = "WhatsApp is opening with your message. Please review it and press Send.";
    window.open(url, "_blank", "noopener,noreferrer");
  });
}
