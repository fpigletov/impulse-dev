'use strict';

export function sliders() {
    
    //Central-Slider 
    if (document.querySelector('.central-slider')) {
        const mainSlider = new Swiper('.central-slider__body', {
            observer: true,
            loop: true,
            effect: 'fade',
            slidesPerView: 1,
            speed: 800,
            pagination: {
                el: '.central-slider__dotts',
                clickable: true
            }
        });

        const slides = document.querySelectorAll('[data-slide]');
        const sliderDotts = document.querySelectorAll('.central-slider__dotts .swiper-pagination-bullet'); 
        let counter = 0;
        
        sliderDotts.forEach(item => {
            item.setAttribute('data-slide', counter++);            
        });

        slides.forEach(item => {
            const slideId = item.dataset.slide;
            const slide = document.querySelector(`[data-slide="${slideId}"]`);
            const slideImage = slide.querySelector('.central-slider__image img').getAttribute('src');            

            const sliderDot = document.querySelector(`.swiper-pagination-bullet[data-slide="${slideId}"]`);
            sliderDot.style.backgroundImage = `url('${slideImage}')`;
        }); 
    }

    //Brands-Slider
    if (document.querySelector('.brands-slider')) {
        const brandsSlider = new Swiper('.brands-slider__body', {
            loop: true,
            slidesPerView: 4,
            spaceBetween: 0,
            speed: 800,
            navigation: {
                nextEl: '.brands-slider__arrow_next',
                prevEl: '.brands-slider__arrow_prev'
            },
            breakpoints: {
                992: {
                    slidesPerView: 4,
                    spaceBetween: 20
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 20
                },
                480: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                0: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
        });
    }
    
    //Product-Slider
    if (document.querySelector('.modal__product')) {

        let sliderProductSlides = new Swiper(".slider-product__subslider", {
            loop: false,
            spaceBetween: 10,
            slidesPerView: 4,
            freeMode: true,
            
            watchSlidesProgress: true,
        });
        
        let sliderProduct = new Swiper(".slider-product__mainslider", {
            loop: true,
            spaceBetween: 10,
            effect: 'fade',
            zoom: {
                maxRatio: 3,
            },
            thumbs: {
                swiper: sliderProductSlides,
            },
        });        
    }

    //Filter Drag Slider
    const filterSlider = document.querySelector('.slider-filter__item');
    const filter = document.querySelector('.filter');
    
    if (filter) {
        noUiSlider.create(filterSlider, {
            start: [20000, 80000],
            connect: true,
            step: 1000,
            range: {
                'min': 0,
                'max': 200000
            },
            tooltips: wNumb({ decimals: 0 }),
    
        });

        const inputStart = document.getElementById('input-start');
        const inputEnd = document.getElementById('input-end');
        const inputs = [inputStart, inputEnd];

        filterSlider.noUiSlider.on('update', (values, handle) => {
            inputs[handle].value = Math.round(values[handle]);
        });
        
        const setPriceValue = () => {
            let inputStartValue;
            let inputEndValue;

            if (inputStart.value !== '') {
                inputStartValue = inputStart.value;
            }

            if (inputEnd.value !== '') {
                inputEndValue = inputEnd.value;
            }

            filterSlider.noUiSlider.set([inputStartValue, inputEndValue]);
        };

        inputStart.addEventListener('change', setPriceValue);
        inputEnd.addEventListener('change', setPriceValue);
    }
}

    

