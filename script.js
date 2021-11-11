'use strict';

//SELECTIONS
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const links = document.querySelectorAll('.nav__link');
const linkList = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const logo = document.querySelector('#logo');
const header = document.querySelector('.header');
const allSection = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');
//MODAL WINDOW
function openModal(e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}
//MODAL
function closeModal() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}

btnOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//SCROLL
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//PAGE NAVIGATION USING EVENT BUBBLING
linkList.addEventListener('click', function (e) {
  e.preventDefault();
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    let section = document.querySelector(`${e.target.getAttribute('href')}`);
    section.scrollIntoView({ behavior: 'smooth' });
  }
  // 1. Add event listener to common parent element
  // 2. Determine what element originated the event
});

//TABBED COMPONENT
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard close
  if (!clicked) return;

  //Active tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Active area
  const activeTab = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  tabsContent.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );
  activeTab.classList.add(`operations__content--active`);
});

//MENU FADE ANIMATION
const handleMouseOver = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    siblings.forEach(function (sibling) {
      if (sibling !== link) {
        sibling.style.opacity = opacity;
      }
    });
  }
};
//Passing an argument into an event handler
nav.addEventListener('mouseover', function (e) {
  handleMouseOver(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handleMouseOver(e, 1);
});

//STICKY NAVIGATION
function stickyNav(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${getComputedStyle(nav).height}`,
});

headerObserver.observe(header);

//REVEAL SECTIONS
function revealSection(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//LAZY LOADING
function loadImage(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function (e) {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

//SLIDER

//FUNCTIONALITY

function sliderFunctionality() {
  function goToSlide(slide) {
    slides.forEach((sld, i) => {
      sld.style.transform = `translate(${(i - slide) * 100}%)`;
    });
  }
  function nextSlide() {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  }

  function prevSlide() {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  }

  function createDot() {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class=dots__dot dots__dot--active" data-slide="${i}"></button>`
      );
    });
  }

  function activateDot(slide) {
    document.querySelectorAll('.dots__dot').forEach(function (dot) {
      dot.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }
  //INITIALIZE
  let currentSlide = 0;
  const maxSlide = slides.length;
  function init() {
    goToSlide(0);
    createDot();
    activateDot(0);
  }
  init();
  //SLIDER BUTTONS
  sliderBtnRight.addEventListener('click', function () {
    nextSlide();
    clearInterval(animate);
  });
  sliderBtnLeft.addEventListener('click', function () {
    prevSlide();
    clearInterval(animate);
  });

  //SLIDER LEFT, RIGHT ARROW KEYS
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  //SLIDER DOTS

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
    clearInterval(animate);
  });

  //Plays slide continuously
  let animate = setInterval(() => {
    nextSlide();
  }, 8000);
}
sliderFunctionality();

// window.addEventListener('beforeunload', function (e) {
//   // e.preventDefault();
//   e.returnValue = '';
//   console.log(e);
// });
