


// Navigation elements
const pageButtons = document.querySelectorAll("[data-page]");
const pageViews = document.querySelectorAll(".page-view");
const navLinks = document.querySelectorAll(".nav-link[data-page]");

const menuButton = document.getElementById("menu-toggle");
const navPanel = document.getElementById("nav-panel");

// Show selected page
function showPage(pageName, updateAddress = true) {
    let activeView = document.getElementById("view-" + pageName);

    if (!activeView) {
        pageName = "home";
        activeView = document.getElementById("view-home");
    }

    if (!activeView) return;

    // Hide all pages and show selected page
    pageViews.forEach(function(view) {
        const selected = view === activeView;

        view.classList.toggle("is-active", selected);
        view.setAttribute("aria-hidden", String(!selected));
    });

    // Update navigation
    navLinks.forEach(function(link) {
        const selected = link.dataset.page === pageName;

        link.classList.toggle("active", selected);

        if (selected) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // Update URL
    if (updateAddress) {
        history.pushState(
            { page: pageName },
            "",
            "#" + pageName
        );
    }

    // Close mobile menu
    if (navPanel) {
        navPanel.classList.remove("open");
    }

    if (menuButton) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
    }

    // Show reveal animations
    activeView.querySelectorAll(".reveal").forEach(function(item) {
        item.classList.add("is-visible");
    });

    // Reset page to top when switching views
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Focus main content
    const main = document.getElementById("page-main");

    if (main) {
        main.focus({ preventScroll: true });
    }

    // Animate skill progress bars
    if (pageName === "skills") {
        fillSkillBars(activeView);
    }
}


// Skills progress bar animation
function fillSkillBars(activeView) {
    const skillBars = activeView.querySelectorAll(
        ".skill-track span[data-level]"
    );

    skillBars.forEach(function(bar) {
        const level = Number(bar.getAttribute("data-level"));

        if (!Number.isFinite(level)) return;

        const safeLevel = Math.max(0, Math.min(100, level));

        // Reset bar
        bar.style.transition = "none";
        bar.style.width = "0%";

        // Restart animation
        void bar.offsetWidth;

        requestAnimationFrame(function() {
            bar.style.transition = "";

            requestAnimationFrame(function() {
                bar.style.width = safeLevel + "%";
            });
        });
    });
}


// Navigation button clicks
pageButtons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        event.preventDefault();

        showPage(button.dataset.page, true);
    });
});


// Internal links
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener("click", function(event) {
        const target = link.getAttribute("href").substring(1);

        if (document.getElementById("view-" + target)) {
            event.preventDefault();

            showPage(target, true);
        }
    });
});


// Browser back and forward buttons
window.addEventListener("popstate", function() {
    showPage(
        location.hash.substring(1) || "home",
        false
    );
});


// Load correct page when website opens
window.addEventListener("DOMContentLoaded", function() {
    showPage(
        location.hash.substring(1) || "home",
        false
    );
});


// Mobile navigation
if (menuButton && navPanel) {

    menuButton.addEventListener("click", function() {
        const isOpen =
            menuButton.getAttribute("aria-expanded") === "true";

        menuButton.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Open navigation" : "Close navigation"
        );

        navPanel.classList.toggle("open", !isOpen);
    });

    // Close menu with Escape key
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            navPanel.classList.remove("open");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation");
        }
    });
}


// Dark and light theme
const themeButton = document.getElementById("theme-toggle");

if (themeButton) {

    const themeIcon = themeButton.querySelector(".theme-icon");

    // Load saved theme
    try {
        if (localStorage.getItem("noman-portfolio-theme") === "dark") {
            document.body.classList.add("dark-theme");
        }
    } catch (error) {
        // Theme still works without local storage
    }

    function updateThemeButton() {
        const darkMode =
            document.body.classList.contains("dark-theme");

        if (themeIcon) {
            themeIcon.textContent = darkMode ? "☀" : "☾";
        }

        themeButton.setAttribute(
            "aria-label",
            darkMode ? "Switch to light theme" : "Switch to dark theme"
        );
    }

    updateThemeButton();

    themeButton.addEventListener("click", function() {

        document.body.classList.toggle("dark-theme");

        try {
            const currentTheme =
                document.body.classList.contains("dark-theme")
                    ? "dark"
                    : "light";

            localStorage.setItem(
                "noman-portfolio-theme",
                currentTheme
            );
        } catch (error) {
            // Theme still works for this visit
        }

        updateThemeButton();
    });
}


// Reveal animations
const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (!reduceMotion) {

    document.querySelectorAll(
        ".page-view.is-active .reveal"
    ).forEach(function(item) {
        item.classList.add("is-visible");
    });

} else {

    document.querySelectorAll(".reveal").forEach(function(item) {
        item.classList.add("is-visible");
    });
}


// Movie and series filters
const filterButtons = document.querySelectorAll(".filter-btn");
const movieCards = document.querySelectorAll(".movie-card");

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const category = button.dataset.filter;

        // Update active filter
        filterButtons.forEach(function(item) {
            item.classList.toggle("active", item === button);
        });

        // Filter movie cards
        movieCards.forEach(function(card) {

            const matches =
                category === "all" ||
                card.dataset.category === category;

            card.hidden = !matches;
        });
    });
});


// Contact form
const contactForm = document.getElementById("contact-form");

if (contactForm) {

    const formStatus = document.getElementById("form-status");

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        const whatsappMessage =
            "Hello Noman, my name is " + name +
            ".\nEmail: " + email +
            "\nMessage: " + message;

        const whatsappURL =
            "https://wa.me/923333147370?text=" +
            encodeURIComponent(whatsappMessage);

        if (formStatus) {
            formStatus.textContent =
                "WhatsApp is opening. Please review your message and press Send.";
        }

        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );
    });
}

