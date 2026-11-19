
// Navigation elements
const pageButtons = document.querySelectorAll("[data-page]");
const pageViews = document.querySelectorAll(".page-view");
const navLinks = document.querySelectorAll(".nav-link[data-page]");

const menuButton = document.getElementById("menu-toggle");
const navPanel = document.getElementById("nav-panel");


// Show selected page
function showPage(pageName, updateAddress = true) {
    let activeView = document.getElementById("view-" + pageName);

    // Open home page if the selected page does not exist
    if (!activeView) {
        pageName = "home";
        activeView = document.getElementById("view-home");
    }

    if (!activeView) return;

    // Hide all pages and show the selected page
    pageViews.forEach(function(view) {
        const isSelected = view === activeView;

        view.classList.toggle("is-active", isSelected);
        view.setAttribute("aria-hidden", String(!isSelected));
    });

    // Update navigation links
    navLinks.forEach(function(link) {
        const isSelected = link.dataset.page === pageName;

        link.classList.toggle("active", isSelected);

        if (isSelected) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // Update the page address
    if (updateAddress) {
        history.pushState(
            { page: pageName },
            "",
            "#" + pageName
        );
    }

    // Close mobile navigation
    if (navPanel) {
        navPanel.classList.remove("open");
    }

    if (menuButton) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
    }

    // Show page animations
    activeView.querySelectorAll(".reveal").forEach(function(item) {
        item.classList.add("is-visible");
    });

    // Move to the top of the page
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Focus the main content
    const main = document.getElementById("page-main");

    if (main) {
        main.focus({ preventScroll: true });
    }

    // Animate skill bars when the Skills page opens
    if (pageName === "skills") {
        fillSkillBars(activeView);
    }
}


// Animate skill progress bars
function fillSkillBars(activeView) {
    const skillBars = activeView.querySelectorAll(
        ".skill-track span[data-level]"
    );

    skillBars.forEach(function(bar) {
        const level = Number(bar.getAttribute("data-level"));

        if (!Number.isFinite(level)) return;

        // Keep the value between 0 and 100
        const safeLevel = Math.max(0, Math.min(100, level));

        // Reset the progress bar
        bar.style.transition = "none";
        bar.style.width = "0%";

        // Restart the animation
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
        showPage(button.dataset.page);
    });
});


// Internal page links
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener("click", function(event) {
        const target = link.getAttribute("href").substring(1);

        if (document.getElementById("view-" + target)) {
            event.preventDefault();
            showPage(target);
        }
    });
});


// Browser back and forward buttons
window.addEventListener("popstate", function() {
    const pageName = location.hash.substring(1) || "home";
    showPage(pageName, false);
});


// Open the correct page when the website loads
window.addEventListener("DOMContentLoaded", function() {
    const pageName = location.hash.substring(1) || "home";
    showPage(pageName, false);
});


// Mobile navigation menu
if (menuButton && navPanel) {

    // Open and close the menu
    menuButton.addEventListener("click", function() {
        const isOpen =
            menuButton.getAttribute("aria-expanded") === "true";

        menuButton.setAttribute("aria-expanded", String(!isOpen));

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Open navigation" : "Close navigation"
        );

        navPanel.classList.toggle("open", !isOpen);
    });

    // Close the menu when Escape is pressed
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

    // Load the saved theme
    try {
        if (localStorage.getItem("noman-portfolio-theme") === "dark") {
            document.body.classList.add("dark-theme");
        }
    } catch (error) {
        // Theme will still work if local storage is unavailable
    }

    // Update the theme button icon and label
    function updateThemeButton() {
        const isDark = document.body.classList.contains("dark-theme");

        if (themeIcon) {
            themeIcon.textContent = isDark ? "☀" : "☾";
        }

        themeButton.setAttribute(
            "aria-label",
            isDark ? "Switch to light theme" : "Switch to dark theme"
        );
    }

    updateThemeButton();

    // Change the theme when the button is clicked
    themeButton.addEventListener("click", function() {
        document.body.classList.toggle("dark-theme");

        try {
            const currentTheme =
                document.body.classList.contains("dark-theme")
                    ? "dark"
                    : "light";

            localStorage.setItem("noman-portfolio-theme", currentTheme);
        } catch (error) {
            // Theme will still work for this visit
        }

        updateThemeButton();
    });
}


// Reveal animations
const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (reduceMotion) {
    // Show all elements without animations
    document.querySelectorAll(".reveal").forEach(function(item) {
        item.classList.add("is-visible");
    });
} else {
    // Show elements on the active page
    document.querySelectorAll(".page-view.is-active .reveal").forEach(function(item) {
        item.classList.add("is-visible");
    });
}


// Movie and series filters
const filterButtons = document.querySelectorAll(".filter-btn");
const movieCards = document.querySelectorAll(".movie-card");

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const category = button.dataset.filter;

        // Update the active filter button
        filterButtons.forEach(function(item) {
            item.classList.toggle("active", item === button);
        });

        // Show matching movie cards
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

        // Check the form fields
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // Get the user's information
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        // Create the WhatsApp message
        const whatsappMessage =
            "Hello Noman, my name is " + name +
            ".\nEmail: " + email +
            "\nMessage: " + message;

        const whatsappURL =
            "https://wa.me/923333147370?text=" +
            encodeURIComponent(whatsappMessage);

        // Show a message before opening WhatsApp
        if (formStatus) {
            formStatus.textContent =
                "WhatsApp is opening. Please review your message and press Send.";
        }

        // Open WhatsApp in a new tab
        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );
    });
}
