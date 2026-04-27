const reveals = document.querySelectorAll(".reveal");
const progress = document.querySelector(".scroll-line");
const gradients = document.querySelectorAll("[data-depth]");
const tiltItems = document.querySelectorAll("[data-tilt]");
const floatingItems = document.querySelectorAll("[data-float]");
const stageItems = document.querySelectorAll("[data-stage]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileLinks = document.querySelectorAll("[data-mobile-menu] a");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.14
});

reveals.forEach((item) => observer.observe(item));

const updateScrollState = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progressWidth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progress) {
    progress.style.width = `${progressWidth}%`;
  }

  if (prefersReducedMotion) {
    return;
  }

  gradients.forEach((gradient) => {
    const depth = Number(gradient.dataset.depth || 0);
    gradient.style.transform = `translate3d(0, ${scrollTop * depth * -0.12}px, 0)`;
  });

  floatingItems.forEach((item) => {
    const depth = Number(item.dataset.float || 1);
    item.style.transform = `translate3d(0, ${scrollTop * depth * -0.035}px, ${120 * depth}px)`;
  });
};

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

const setMenuState = (isOpen) => {
  if (!menuToggle || !mobileMenu) {
    return;
  }

  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
};

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      setMenuState(false);
    }
  });
}

if (!prefersReducedMotion) {
  tiltItems.forEach((item) => {
    const resetTilt = () => {
      item.style.transform = "";
    };

    item.addEventListener("pointermove", (event) => {
      const bounds = item.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width;
      const py = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (px - 0.5) * 9;
      const rotateX = (0.5 - py) * 9;
      const lift = item.classList.contains("hero-card") ? 120 : 16;

      item.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -6px, ${lift}px)`;
    });

    item.addEventListener("pointerleave", resetTilt);
  });

  stageItems.forEach((stage) => {
    const resetStage = () => {
      stage.style.transform = "";
    };

    window.addEventListener("mousemove", (event) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = (event.clientX / innerWidth) - 0.5;
      const offsetY = (event.clientY / innerHeight) - 0.5;

      stage.style.transform = `rotateX(${(offsetY * -2.5).toFixed(2)}deg) rotateY(${(offsetX * 3.5).toFixed(2)}deg)`;
    });

    stage.addEventListener("pointerleave", resetStage);
    document.addEventListener("mouseleave", resetStage);
  });
}
