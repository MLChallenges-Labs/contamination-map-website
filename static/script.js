const backToTop = document.getElementById('back-to-top');
const hero = document.getElementById('hero');

if (backToTop && hero) {
  const toggleVisibility = () => {
    const pastHero = window.scrollY > hero.offsetHeight * 0.5;
    backToTop.classList.toggle('is-visible', pastHero);
  };

  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });
}
