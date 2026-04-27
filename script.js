const reveals = document.querySelectorAll(".reveal");
const progress = document.querySelector(".scroll-line");
const gradients = document.querySelectorAll("[data-depth]");
const tiltCard = document.querySelector("[data-tilt]");
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
};

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

if (tiltCard && !prefersReducedMotion) {
  const resetTilt = () => {
    tiltCard.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  window.addEventListener("mousemove", (event) => {
    const { innerWidth, innerHeight } = window;
    const rotateY = ((event.clientX / innerWidth) - 0.5) * 10;
    const rotateX = (((event.clientY / innerHeight) - 0.5) * -1) * 10;

    tiltCard.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  document.addEventListener("mouseleave", resetTilt);
}
