'use strict';

export function loadingProducts() {
    const catalog = document.querySelector('.catalog-items');
    const catalogItemsList = document.querySelector('.catalog-items__products');
    const moreBtn = document.querySelector('.catalog-items__btn');
    const popular = document.querySelector('.popular');
    const popularItemsList = document.querySelector('.popular__body');
    const wrapper = document.querySelector('.wrapper');    
    let productQuantity = 0;
    let dataLength = null;

    //Convert to Normal Price
    function normalPrice(str) {
        return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    }

    //Load Lists
    const loadingList = (list, quantity) => {
        fetch('https://fpigletov-db.herokuapp.com/impulse/')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                dataLength = data.products.length;

                list.innerHTML = '';

                for (let i = 0; i < dataLength; i++) {
                    if (i < quantity) {
                        let item = data.products[i];
                        
                        list.innerHTML += `

                            <li data-id="${item.id}" class="item-product item-product_hover">                                        
                                <div class="item-product__image">
                                    <picture>
                                        <source srcset="${item.mainImageWebp}" type="image/webp">
                                        <img loading="lazy" src="${item.mainImageJpg}" width="160" height="175" alt="${item.mainImageAlt}">
                                    </picture> 
                                </div>
                                <div class="item-product__name">
                                    <div class="item-product__title">
                                        ${item.title}
                                    </div>
                                    <div class="item-product__subtitle">
                                        ${item.subtitle}
                                    </div>
                                </div>
                                <div class="item-product__btns">
                                    <button data-show-id=${item.id} type="button" class="item-product__btn icon-eye-solid show-product-btn" aria-label="Показать товар"></button>
                                    <button type="button" data-btn-id="${item.id}" class="item-product__btn icon-cart-shopping-solid add-btn" aria-label="Добавить в корзину"></button>
                                </div>
                                <div class="item-product__footer">
                                    <div class="item-product__price product-price">${normalPrice(item.price)}₽</div>
                                    <div class="item-product__old-price product-old-price">${normalPrice(item.oldPrice ? item.oldPrice + '₽' : '')}</div>
                                </div>
                                <div class="item-product__hover hover-item">
                                    <div class="hover-item__title">
                                        <span>${item.title}</span>${item.subtitle}
                                    </div>
                                    <div class="hover-item__descr">
                                        ${Object.keys(item.specification)[0]} 
                                        <span>${Object.values(item.specification)[0]}</span> 
                                        ${Object.keys(item.specification)[1]} 
                                        <span>${Object.values(item.specification)[1]}</span>
                                        ${Object.keys(item.specification)[2]}
                                        <span>${Object.values(item.specification)[2]}</span>
                                    </div>
                                    <div class="hover-item__btns">
                                        <button data-show-id=${item.id} type="button" class="hover-item__btn icon-eye-solid show-product-btn" aria-label="Показать товар" ></button>
                                        <button type="button" data-btn-id="${item.id}" class="hover-item__btn icon-cart-shopping-solid add-btn" aria-label="Добавить в корзину"></button>
                                    </div>
                                    <div class="hover-item__footer">
                                        <div class="hover-item__price product-price">${normalPrice(item.price)}₽</div>
                                        <div class="hover-item__old-price product-old-price">${normalPrice(item.oldPrice ? item.oldPrice + '₽' : '')}</div>
                                    </div>
                                </div>
                            </li>

                        `;
                    }
                }
            });
    };

    if (catalog) {
        if (catalogItemsList) {
            productQuantity = 9;

            loadingList(catalogItemsList, productQuantity);

            moreBtn.addEventListener('click', (e) => {
                productQuantity += 3;

                loadingList(catalogItemsList, productQuantity);
                
                if (productQuantity >= dataLength) {
                    moreBtn.style.display = 'none';
                } else {
                    moreBtn.style.display = 'inline-flex';
                }
            });
        }
    }

    if (popular) {
        productQuantity = 15;        
        loadingList(popularItemsList, productQuantity);
    }
    
    //Load Product Page
    const loadProductData = (id) => {
        const productName = document.querySelector('.product__name');
        const productSlides = document.querySelectorAll('[data-slide-zoom]');
        const productSubslides = document.querySelectorAll('.slider-product__subslide');
        const productPrice = document.querySelector('.info-product__prices');
        const productDescr = document.querySelector('.descr-product__text_descr');
        const productSpec = document.querySelector('.descr-product__text_spec');
        const productBtn = document.querySelector('.info-product__add');

        fetch('https://fpigletov-db.herokuapp.com/impulse/')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                
                productName.innerHTML = '';

                productSlides.forEach(item => {
                    item.innerHTML = '';
                });

                productSubslides.forEach(item => {
                    item.innerHTML = '';
                });
                
                productPrice.innerHTML = '';
                productDescr.innerHTML = '';
                productSpec.innerHTML = '';
                productBtn.innerHTML = '';

                for (let dataItem of data.products) {
                    if (dataItem.id == id) {
                        
                        //Product Name
                        productName.innerHTML = `
                            <h1 class="product__title">${dataItem.title}</h1> 
                            <div class="product__subtitle">${dataItem.subtitle}</div>
                        `;

                        //Product Slider
                        productSlides.forEach(el => {
                            const slideId = el.dataset.slideZoom;
                            const slide = document.querySelector(`[data-slide-zoom="${slideId}"]`);

                            slide.innerHTML = `
                                <picture>
                                    <source srcset="${dataItem.galleryWebp[slideId]}" type="image/webp">
                                    <img loading="lazy" src="${dataItem.galleryJpg[slideId]}" width="280" height="280" alt="${dataItem.mainImageAlt}">
                                </picture>
                            `;
                        });

                        for (let k = 0; k < productSubslides.length; k++) {
                            productSubslides[k].innerHTML = `
                                <picture>
                                    <source srcset="${dataItem.galleryWebp[k]}" type="image/webp">
                                    <img loading="lazy" src="${dataItem.galleryJpg[k]}" width="280" height="280" alt="${dataItem.mainImageAlt}">
                                </picture>
                            `;
                        }
                        
                        //Product Price
                        productPrice.innerHTML = `
                            <div class="info-product__old-price">${normalPrice(dataItem.oldPrice ? dataItem.oldPrice + '₽' : '')}</div>
                            <div class="info-product__current-price">${normalPrice(dataItem.price)}₽</div>
                        `;

                        //Product Btn
                        productBtn.innerHTML = `
                            <div class="info-product__tag">В корзину</div>
                            <button data-btn-id="${dataItem.id}" class="info-product__cart icon-cart-shopping-solid add-btn"></button>
                        `;

                        //Product Descr
                        productDescr.innerHTML = `${dataItem.descr}`;

                        //Product Specification                        
                        let specItems = '';
                        Object.keys(dataItem.specification).forEach(key => {
                            specItems += `${key}: ${dataItem.specification[key]}<br>`;
                        });
                        productSpec.innerHTML = specItems;
                        
                    }
                }
            })
            .then(() => {
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
                    keyboard: {
                        enabled: true,
                        onlyInViewport: true,
                    },
                    effect: 'fade',
                    zoom: {
                        maxRatio: 3,
                    },
                    thumbs: {
                        swiper: sliderProductSlides,
                    },
                });
            });
    
    };

    document.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.classList.contains('show-product-btn')) {
            e.preventDefault();            
            const itemId = e.target.getAttribute('data-show-id');
            loadProductData(itemId);
        }
        
    });

    
    //Load Side Menu
    const loadSideMenu = () => {
        const submenuProducts = document.querySelectorAll('.submenu-side__product[data-submenu]');
        
        fetch('https://fpigletov-db.herokuapp.com/impulse/')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                dataLength = data.products.length;

                submenuProducts.forEach(el => {
                    el.innerHTML = '';
                });
                    
                for (let i = 0; i < submenuProducts.length; i++) {
                        
                    let item = data.products[i];
                        
                    submenuProducts[i].innerHTML = `                        
                            
                            <li data-id="${item.id}" class="item-product">                                        
                                <div class="item-product__image">
                                    <picture>
                                        <source srcset="${item.mainImageWebp}" type="image/webp">
                                        <img loading="lazy" src="${item.mainImageJpg}" width="160" height="175" alt="${item.mainImageAlt}">
                                    </picture> 
                                </div>
                                <div class="item-product__name">
                                    <div class="item-product__title">
                                        ${item.title}
                                    </div>
                                    <div class="item-product__subtitle">
                                        ${item.subtitle}
                                    </div>
                                </div>
                                <div class="item-product__btns">
                                    <button data-show-id=${item.id} type="button" class="item-product__btn icon-eye-solid show-product-btn" aria-label="Посмотреть товар"></button>
                                    <button type="button" data-btn-id="${item.id}" class="item-product__btn icon-cart-shopping-solid add-btn" aria-label="Добавить в корзину"></button>
                                </div>
                                <div class="item-product__footer">
                                    <div class="item-product__price product-price">${normalPrice(item.price)}₽</div>
                                    <div class="item-product__old-price product-old-price">${normalPrice(item.oldPrice ? item.oldPrice + '₽' : '')}</div>
                                </div>                                
                            </li>

                        `;
                }
            });
    };

    loadSideMenu();
    
}