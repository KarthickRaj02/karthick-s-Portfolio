// Theme persistence
(function initializeTheme() {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    }
  } catch {}
})();

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const docEl = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const yearEl = document.getElementById("year");

  // Year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = docEl.getAttribute("data-theme") === "light";
      if (isLight) {
        docEl.removeAttribute("data-theme");
        themeToggle.querySelector(".theme-icon").textContent = "🌙";
        try { localStorage.setItem("theme", "dark"); } catch {}
      } else {
        docEl.setAttribute("data-theme", "light");
        themeToggle.querySelector(".theme-icon").textContent = "🌞";
        try { localStorage.setItem("theme", "light"); } catch {}
      }
    });
  }

  // Mobile nav
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navMenu.classList.toggle("open", !expanded);
    });
    navMenu.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("open");
      })
    );
  }

  // Smooth focus on skip link target
  const mainEl = document.getElementById("main");
  if (mainEl) {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href").slice(1);
        const target = document.getElementById(id);
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  // Contact form validation + mailto fallback
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.getElementById("form-status");
      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");
      const nameError = document.getElementById("name-error");
      const emailError = document.getElementById("email-error");
      const messageError = document.getElementById("message-error");

      let hasError = false;
      // Name
      if (!nameInput.value.trim()) {
        nameError.textContent = "Please enter your name.";
        hasError = true;
      } else nameError.textContent = "";
      // Email
      const emailVal = emailInput.value.trim();
      const emailOk = /.+@.+\..+/.test(emailVal);
      if (!emailOk) {
        emailError.textContent = "Enter a valid email.";
        hasError = true;
      } else emailError.textContent = "";
      // Message
      if (!messageInput.value.trim()) {
        messageError.textContent = "Please write a message.";
        hasError = true;
      } else messageError.textContent = "";

      if (hasError) return;

      const subject = encodeURIComponent(`Portfolio inquiry from ${nameInput.value.trim()}`);
      const body = encodeURIComponent(`${messageInput.value.trim()}\n\nFrom: ${nameInput.value.trim()} <${emailVal}>`);
      const mailto = `mailto:karthickraj12112004@gmail.com?subject=${subject}&body=${body}`;
      status.textContent = "Opening email client...";
      window.location.href = mailto;
      setTimeout(() => (status.textContent = ""), 2000);
      form.reset();
    });
  }

  // Reveal on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".section, .project-card, .skill-card, .timeline-item").forEach((el) => observer.observe(el));
});

//carousel
const track = document.querySelector(".carousel-track");
const cards = document.querySelectorAll(".certifications-card");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const container = document.querySelector(".carousel");

let index = 0;
const total = cards.length;

function getCardWidth() {
  // width of a single card (no margins are used)
  return cards[0].getBoundingClientRect().width;
}

function getContainerWidth() {
  return container.getBoundingClientRect().width;
}

function updateCarousel() {
  const cardWidth = getCardWidth();
  const containerWidth = getContainerWidth();
  // center the current card
  const offset = -index * cardWidth + (containerWidth / 2 - cardWidth / 50);
  track.style.transform = `translateX(${offset}px)`;
  cards.forEach(c => c.classList.remove("active"));
  cards[((index % total) + total) % total].classList.add("active");
}

nextBtn.addEventListener("click", () => {
  index = (index + 1) % total;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + total) % total;
  updateCarousel();
});

window.addEventListener("resize", updateCarousel);
updateCarousel();