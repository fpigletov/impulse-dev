'use strict';

export function lazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src],source[data-srcset]');
    const windowHeight = document.documentElement.clientHeight;

    let lazyImagesPositions = [];
    if (lazyImages.length > 0) {
        lazyImages.forEach(item => {
            if (item.dataset.src || item.dataset.srcset) {
                lazyImagesPositions.push(item.getBoundingClientRect().top + pageYOffset);
                lazyScrollCheck();
            }
        });
        console.log(lazyImagesPositions);
    }
    console.log(lazyImagesPositions);
    function lazyScroll() {
        if (document.querySelectorAll('img[data-src],source[data-srcset]') > 0) {
            lazyScrollCheck();
        }
    }

    window.addEventListener('scroll', lazyScroll);


    function lazyScrollCheck() {
        let imgIndex = lazyImagesPositions.findIndex(
            item => pageYOffset > item - windowHeight
        );

        console.log(imgIndex);
        console.log(pageYOffset);
        console.log(windowHeight);

        if (imgIndex >= 0) {
            if (lazyImages[imgIndex].dataset.src) {
                lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
                lazyImages[imgIndex].removeAttribute('data-src');
            } else if (lazyImages[imgIndex].dataset.srcset) {
                lazyImages[imgIndex].srcset = lazyImages[imgIndex].dataset.srcset;
                lazyImages[imgIndex].removeAttribute('data-srcset');
            }

            delete lazyImagesPositions[imgIndex];
        }
    }
}