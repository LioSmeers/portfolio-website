const reveals = document.querySelectorAll('.reveal');
const progress = document.querySelector('.scroll-line');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.15
});

reveals.forEach((item) => observer.observe(item));

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progressWidth = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progress.style.width = `${progressWidth}%`;
});
