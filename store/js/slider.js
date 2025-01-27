const defaultImages = [
    {src: 'images/1.jpg', alt: 'first car' },
    {src: 'images/2.jpg', alt: 'second car' },
    {src: 'images/3.jpg', alt: 'third car' },
    {src: 'images/4.jpg', alt: 'fourth car' },
    {src: 'images/5.jpg', alt: 'fifth car' },
  ];

function generateLayout() {
    return `<div class="slider">
    <div class="slides">
    </div>

    <div class="controls">
      <button type="button" class="prev-btn" data-action="prev">Prev</button>
      <button type="button" class="next-btn" data-action="next">Next</button>
    </div>
  
    <div class="indicators">
    </div>
  </div>`
}

function slider(imagesArray = defaultImages) {

const INTERVAL = 3000;
let currentSlide = 0;
const slidesElement = document.querySelector('.slides');
const indicatorsElement = document.querySelector('.indicators');
const DEFAULT_ACTION = 'next';
let isOnPause = false;
const dragging = {
    startX: 0,
    endX: 0,
}


function generateSlider() {
    imagesArray.forEach((image, index) => {
        generateSlide(image, index, slidesElement);
        generateIndicator(index, indicatorsElement);
    })
}

function generateSlide(image, index, parent) {
    const slide = document.createElement('div');
    slide.classList.add('slide');

    index === 0 ? slide.classList.add('active') : null;

    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;

    slide.appendChild(img);
    parent.appendChild(slide);
}

function generateIndicator(index, parent) {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    
    index === 0 ? indicator.classList.add('active') : null;

    indicator.setAttribute('data-id', index);
    parent.appendChild(indicator);
}

generateSlider();


function changeSlide(action = DEFAULT_ACTION, slideNumber = null) {
    slidesElement.children[currentSlide].classList.remove('active');
    indicatorsElement.children[currentSlide].classList.remove('active');

    if (action || slideNumber !== null) {
        clearInterval(timer);
        timer = setInterval(changeSlide, INTERVAL);
    }

    if (slideNumber !== null) {
        currentSlide = slideNumber;
    } else {
        const lastElement = slidesElement.children.length - 1;

        if (action === 'prev') {
            currentSlide = currentSlide === 0 ? lastElement : (currentSlide - 1);
        } else {
            currentSlide = currentSlide === lastElement ? 0 : (currentSlide + 1);
        }
    }

    slidesElement.children[currentSlide].classList.add('active');
    indicatorsElement.children[currentSlide].classList.add('active');
}

let timer = setInterval(changeSlide, INTERVAL)

document.querySelector('.prev-btn').addEventListener('click', () => changeSlide('prev'));
document.querySelector('.next-btn').addEventListener('click', () => changeSlide('next'));

document.querySelector('.indicators').addEventListener('click', event => {
    if (event.target.tagName === "DIV" && event.target.classList.contains('indicator')) {
        const indicatorID = parseInt(event.target.getAttribute('data-id'));
        changeSlide(null, indicatorID);
    }
})


slidesElement.addEventListener('touchstart', event => {
    dragging.startX = event.touches[0].clientX;
})

slidesElement.addEventListener('touchend', event => {
    dragging.endX = event.changedTouches[0].clientX;
    changeSlide(dragging.startX < dragging.endX ? 'prev' : 'next');
})


document.addEventListener('keydown', event => {
    console.log(event.code)

    if (event.code === 'ArrowLeft') {
        changeSlide('prev');
    } else if (event.code === 'ArrowRight') {
        changeSlide('next');
    } else if (event.code === 'Space') {
        if (isOnPause) {
            timer = setInterval(changeSlide, INTERVAL);
        } else {
            clearInterval(timer);
        }
        isOnPause = !isOnPause;
    }
})


slidesElement.addEventListener('mouseenter', event => {
    console.log(event);
    clearInterval(timer);
})

slidesElement.addEventListener('mouseleave', event => {
    console.log(event);
    timer = setInterval(changeSlide, INTERVAL);
})

}