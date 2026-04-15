const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const progressBar = document.querySelector(".scroll-progress");
const interactiveCards = document.querySelectorAll(".interactive-card");
const decorativeOrbs = document.querySelectorAll(".orb");
const typeName = document.querySelector(".type-name");
const typeCursor = document.querySelector(".type-cursor");
const scrollTopButton = document.querySelector(".scroll-top");

const smoothScrollToY = (targetY, duration = 520) => {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      window.requestAnimationFrame(animate);
    }
  };

  window.requestAnimationFrame(animate);
};

const closeMenu = () => {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        closeMenu();
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        closeMenu();
        return;
      }

      event.preventDefault();
      const headerOffset = 110;
      const targetY = Math.max(0, target.offsetTop - headerOffset);

      closeMenu();
      smoothScrollToY(targetY);
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const setActiveNav = () => {
  let activeId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 160;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
  });
};

const updateScrollProgress = () => {
  if (!progressBar) {
    return;
  }

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${progress})`;
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 24}ms`;
  revealObserver.observe(item);
});

interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  });
});

const startTypewriter = () => {
  if (!typeName) {
    return;
  }

  const text = "AYUSH MISHRA";
  const writeDelay = 58;
  const eraseDelay = 36;
  const pauseAfterWrite = 900;
  const pauseAfterErase = 180;
  let isDeleting = false;
  let index = 0;
  let timeoutId;

  typeName.textContent = "";

  const tick = () => {
    if (!isDeleting) {
      if (index < text.length) {
        index += 1;
        typeName.textContent = text.slice(0, index);
        timeoutId = window.setTimeout(tick, text[index - 1] === " " ? 80 : writeDelay);
        return;
      }

      isDeleting = true;
      timeoutId = window.setTimeout(tick, pauseAfterWrite);
      return;
    }

    if (index > 0) {
      index -= 1;
      typeName.textContent = text.slice(0, index);
      timeoutId = window.setTimeout(tick, eraseDelay);
      return;
    }

    isDeleting = false;
    timeoutId = window.setTimeout(tick, pauseAfterErase);
  };

  window.clearTimeout(timeoutId);
  timeoutId = window.setTimeout(tick, 180);
};

const toggleScrollTopButton = () => {
  if (!scrollTopButton) {
    return;
  }

  scrollTopButton.classList.toggle("is-visible", window.scrollY > 280);
};

if (scrollTopButton) {
  scrollTopButton.addEventListener("click", () => {
    smoothScrollToY(0);
  });
}

window.addEventListener("scroll", () => {
  setActiveNav();
  updateScrollProgress();
  toggleScrollTopButton();

  const scrollOffset = window.scrollY;
  decorativeOrbs.forEach((orb, index) => {
    orb.style.transform = `translateY(${scrollOffset * (0.04 * (index + 1))}px)`;
  });
});

window.addEventListener("load", () => {
  setActiveNav();
  updateScrollProgress();
  toggleScrollTopButton();
  startTypewriter();
});
