const reveals = document.querySelectorAll(".reveal");
const progress = document.querySelector(".scroll-line");
const gradients = document.querySelectorAll("[data-depth]");
const tiltItems = document.querySelectorAll("[data-tilt]");
const floatingItems = document.querySelectorAll("[data-float]");
const heroStage = document.querySelector("[data-stage]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.15
});

reveals.forEach((item) => observer.observe(item));

const updateScrollState = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progressWidth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progress.style.width = `${progressWidth}%`;

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

if (!prefersReducedMotion) {
  tiltItems.forEach((item) => {
    const resetTilt = () => {
      item.style.transform = "";
    };

    item.addEventListener("pointermove", (event) => {
      const bounds = item.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width;
      const py = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (px - 0.5) * 10;
      const rotateX = (0.5 - py) * 10;
      const lift = item.classList.contains("hero-card") ? 110 : 16;

      item.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(0, -6px, ${lift}px)`;
    });

    item.addEventListener("pointerleave", resetTilt);
  });

  if (heroStage) {
    window.addEventListener("mousemove", (event) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = (event.clientX / innerWidth) - 0.5;
      const offsetY = (event.clientY / innerHeight) - 0.5;

      heroStage.style.transform = `rotateX(${(offsetY * -3).toFixed(2)}deg) rotateY(${(offsetX * 4).toFixed(2)}deg)`;
    });

    document.addEventListener("mouseleave", () => {
      heroStage.style.transform = "";
    });
  }
}
