class Slider {
  constructor(images, time) {
    this.imagesArray = images;
    this.slider = null;
    this.sliderContainer = null;
    this.imageContainer = null;
    this.prevBtn = null;
    this.nextBtn = null;
    this.dotsContainer = null;
    this.image = null;
    this.currentSlide = 0;
    this.imageContainerWidth = null;
    this.numberOfImgElements = this.imagesArray.length;
    this.numberNewItems = 1;
    this.flexDirection = null;
    this.percenValueMove = null;
    this.timmerIndex = null;
    this.time = time;
    this.UiSelectors = {
      slider: '[data-slider]',
      sliderContainer: '[data-slider-container]',
      imageContainer: '[data-slider-image-container]',
      prevBtn: '[data-prevBtn="LeftBtn"]',
      nextBtn: '[data-nextBtn]',
      dotsContainer: '[data-slider-dots]'
    };
    //touchpad
    this.dragging = false;
    this.startTouchX = null;
    this.touchPx = null;
    this.percent = null;
    this.timeTouchStart = null;
    this.timeTouch = null;

    this.render();
  };

  render() {
    //download items
    this.slider = document.querySelector(this.UiSelectors.slider);
    this.sliderContainer = document.querySelector(this.UiSelectors.sliderContainer);
    this.prevBtn = document.querySelector(this.UiSelectors.prevBtn);
    this.nextBtn = document.querySelector(this.UiSelectors.nextBtn);
    this.dotsContainer = document.querySelector(this.UiSelectors.dotsContainer);
    this.imageContainer = document.querySelector(this.UiSelectors.imageContainer);
    this.flexDirection = window.getComputedStyle(this.sliderContainer, null).getPropertyValue('justify-Content');
    //function call
    this.createImage(this.numberOfImgElements);
    this.setAttributes(this.numberOfImgElements, this.imagesArray.length);
    this.timmerIndex = setInterval(this.autoChangeSlide.bind(this), this.time);
    this.addListeners();
  };

  createImage(imagesLength) {
    for(let i = 0; i < imagesLength ; i++) {
      //create Image elements
      this.image = document.createElement('img');
      this.image.classList = `slider__image`;
      this.image.setAttribute('draggable', 'false');
      this.imageContainer.appendChild(this.image);
      //create dost
      this.dot = document.createElement('button');
      i === 0 ? this.dot.classList = `slider__dot active` : this.dot.classList = `slider__dot`;
      this.dotsContainer.appendChild(this.dot);
    };
  };

  setAttributes(numberImgElements, imgArrayLength) {
    this.imageContainer.hasChildNodes() && this.imageContainer.childNodes.forEach((img, index) => {
      img.setAttribute('src', Array.isArray(this.imagesArray) && this.imagesArray.length && this.imagesArray[index]);
      img.setAttribute('alt', img.src.slice(img.src.lastIndexOf('/')+1, img.src.lastIndexOf('.')));
    });
  };

  calculationOfSlideShift(direction, multiplier) {
    const imageContainerWidth = parseInt(this.imageContainer.style.getPropertyValue('width'), 10);
    this.percenValueMove = Number(((this.imageContainerWidth * multiplier) / imageContainerWidth * (`${direction === 'next' ? '-100' : '100'}`)).toFixed(2));
  };

  changeDirection(direction, flexDirection) {
    this.flexDirection = flexDirection;
    this.sliderContainer.style.webkitJustifyContent = this.flexDirection;
    if(direction === 'prev') {
      this.imageContainer.appendChild(this.imageContainer.firstElementChild);
    } else if(direction === 'next') {
      this.imageContainer.prepend(this.imageContainer.lastElementChild);
    };
  };

  prepareSlideChange(direction, multiplier = 1) {
    this.calculationOfSlideShift(direction, multiplier);
    if (direction === 'prev' && this.flexDirection === 'flex-start') {
      this.changeDirection(direction, 'flex-end');
    } else if (direction === 'next' && this.flexDirection === 'flex-end') {
      this.changeDirection(direction, 'flex-start');
    };
  };

  moveTouchSlide(clientX) {
    this.touchPx = clientX;
    this.percent = Number((clientX / this.imageContainerWidth * 100).toFixed());
    this.imageContainer.style.webkitTransition = 'transform 0ms linear';
    this.imageContainer.style.webkitTransform = `translate3d(${this.touchPx}px, 0, 0)`;
    if (this.touchPx > 0) this.prepareSlideChange('prev');
    else if(this.touchPx < 0) this.prepareSlideChange('next');
  };

  startChangeSlide() {
    this.imageContainer.style.webkitTransition = 'transform 1000ms ease-in-out';
    this.imageContainer.style.webkitTransform = `translate3d(${this.percenValueMove}%, 0, 0)`;
  };

  endChangeSlide() {
    if (this.flexDirection === `flex-start`) {
      for (let i = 0; i < this.numberNewItems ; i++) {
        this.imageContainer.appendChild(this.imageContainer.firstElementChild);
      };
    } else if (this.flexDirection === 'flex-end') {
      for (let i = 0; i < this.numberNewItems ; i++) {
        this.imageContainer.prepend(this.imageContainer.lastElementChild);
      };
    };
    this.imageContainer.style.webkitTransition = 'out';
    this.imageContainer.style.webkitTransform = `translate3d(0, 0, 0)`;
    setTimeout(() => {
      this.imageContainer.style.webkitTransform = '';
      this.numberNewItems = 1;
    });
  };

  setDot(index) {
    this.dotsContainer.childNodes.forEach((dot, dotIndex) => {
      dotIndex === index ? dot.classList.add('active') : dot.classList.remove('active');
    });
  };

  slideChangeSteps(direction, touch = false, numberNewItems = this.numberNewItems, index = null) {
    if (!touch) this.prepareSlideChange(direction, numberNewItems);
    this.startChangeSlide();
    if (index != null) this.currentSlide = index;
    else
      direction === 'prev' ? this.currentSlide = this.imagesArray.indexOf(this.imageContainer.childNodes[this.numberOfImgElements - 2].getAttribute('src')) : this.currentSlide = this.imagesArray.indexOf(this.imageContainer.childNodes[1].getAttribute('src'));
    this.setDot(this.currentSlide);
  };

  autoChangeSlide() {
    this.slideChangeSteps('next');
  }

  addListeners() {
    document.addEventListener('DOMContentLoaded', () => {

      const adjustImageSize = () => {
        this.imageContainerWidth = this.sliderContainer.clientWidth;
        this.imageContainer.setAttribute('style', `width: ${this.imageContainerWidth * this.numberOfImgElements}px`);
        this.imageContainer.hasChildNodes() && this.imageContainer.childNodes.forEach(img => {
          img.setAttribute('style', `width: ${this.imageContainerWidth}px`);
         });
      };

      const initEvents = () => {

        this.prevBtn.addEventListener('click', () => {
          clearInterval(this.timmerIndex);
          this.slideChangeSteps('prev');
          setTimeout(() => {
            this.timmerIndex = setInterval(this.autoChangeSlide.bind(this), this.time);
          });
        });

        this.nextBtn.addEventListener('click', () => {
          clearInterval(this.timmerIndex);
          this.slideChangeSteps('next');
          setTimeout(() => {
            this.timmerIndex = setInterval(this.autoChangeSlide.bind(this), this.time);
          });
        });

        this.imageContainer.addEventListener('transitionend', this.endChangeSlide.bind(this), false);

        this.imageContainer.addEventListener('touchstart', e => {
          if(e.targetTouches.length === 1) {
            e.preventDefault();
            clearInterval(this.timmerIndex);
            this.dragging = !this.dragging;
            this.imageContainer.style.cursor = `grabbing`;
            this.startTouchX = e.targetTouches[0].pageX;
            this.timeTouchStart = +new Date();
          };
        });

        this.imageContainer.addEventListener('touchmove', e => {
          if (this.dragging) this.moveTouchSlide(e.targetTouches[0].pageX  - this.startTouchX);
        });

        this.imageContainer.addEventListener('touchend', e => {
          this.timeTouch = Number(((+new Date() - this.timeTouchStart) / 1000).toFixed(2));
          this.imageContainer.style.cursor = '';
          if (this.timeTouch > 0.15 && this.timeTouch < 0.5) this.flexDirection === 'flex-end' ? this.slideChangeSteps('prev', true) : this.slideChangeSteps('next', true);
          else if (this.percent >= 50 || this.percent <= -50) this.flexDirection === 'flex-end' ? this.slideChangeSteps('prev', true) : this.slideChangeSteps('next', true);
          else {
            this.imageContainer.style.webkitTransition = 'transform 1000ms ease-in-out';
            this.imageContainer.style.webkitTransform = `translate3d(0, 0, 0)`;
            this.imageContainer.removeEventListener('transitionend', this.endChangeSlide.bind(this), false);
            setTimeout(()=> {
              this.imageContainer.style.webkitTransition = 'out';
              this.imageContainer.style.webkitTransform = '';
            }, 1000);
          };
          this.dragging = !this.dragging;
          setTimeout(() => {
            this.timmerIndex = setInterval(this.autoChangeSlide.bind(this), this.time);
          });
        });

        this.dotsContainer.childNodes.forEach((dot, index) => {
          dot.addEventListener('click', () => {
            if (this.currentSlide != index) {
              clearInterval(this.timmerIndex);
              if (this.currentSlide > index) {
                //prev
                this.numberNewItems = this.currentSlide - index;
                this.slideChangeSteps('prev', false, this.numberNewItems, index);
              } else if (this.currentSlide != index && this.currentSlide < index) {
                //next
                this.numberNewItems = index - this.currentSlide;
                this.slideChangeSteps('next', false, this.numberNewItems, index);
              }
              this.dotsContainer.childNodes.forEach(dot =>{
                dot.setAttribute('disabled', false);
              })
              setTimeout(()=>{
                this.dotsContainer.childNodes.forEach(dot =>{
                  dot.removeAttribute('disabled');
                });
                this.timmerIndex = setInterval(this.autoChangeSlide.bind(this), this.time);
              },1100);
            };
          });
        });
      };

      window.addEventListener('resize', adjustImageSize );
      adjustImageSize();
      initEvents();
    });
  };
};