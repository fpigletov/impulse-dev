'use strict';

//SlideToggle
export let slideUp = (target, duration = 500) => {
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.style.display = 'none';
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('slide');
        }, duration);
    };
export let slideDown = (target, duration = 500) => {
        target.style.removeProperty('display');
        let display = window.getComputedStyle(target).display;
        if (display === 'none') {
            display = 'block';
        }
            

        target.style.display = display;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('slide');
        }, duration);
    };

export let slideToggle = (target, duration = 500) => {
        if (!target.classList.contains('slide')) {
            target.classList.add('slide');
            if (window.getComputedStyle(target).display === 'none') {
                return slideDown(target, duration);
            } else {
                return slideUp(target, duration);
            }
        }
    };

//Burger Menu
export function burgerMenu(btnSelector, bodySelector, itemsSelector) {

    const btn = document.querySelector(btnSelector);
    const body = document.querySelector(bodySelector);
    const items = document.querySelectorAll(itemsSelector);

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        body.classList.toggle('active');

        let ariaLabel = btn.getAttribute('aria-label');
        if (ariaLabel === 'Открыть меню') {
            btn.setAttribute('aria-label', 'Закрыть меню');
        } else {
            btn.setAttribute('aria-label', 'Открыть меню');
        }
    });

    

    items.forEach(item => {
        item.addEventListener('click', () => {
            body.classList.toggle('active');
            btn.classList.toggle('active');
        });
    });
}

//Modals
export function modal(triggerSelector, contentSelector) {
    const modal = document.querySelector('.modal');    
    const modalCloseBtn = modal.querySelector('.modal__close');
    const modalContent = modal.querySelector(contentSelector);    
    const trigger = document.querySelector(triggerSelector);
    const wrapper = document.querySelector('.wrapper');
    const header = document.querySelector('.header');
    const scrollWidth = window.innerWidth - wrapper.offsetWidth + 'px';
    let lastFocusedEl;
    

    const openModal = () => {
        modal.classList.add('active');        
        modalContent.classList.add('active');
        modalContent.scrollTop = 0;        
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = scrollWidth;
        header.style.paddingRight = scrollWidth;  
        lastFocusedEl = document.activeElement;
        
        Array.from(document.body.children).forEach(item => {
            if (item !== modal) {
                item.inert = true;
            }
        });        
    };

    const closeModal = () => {        
        modal.classList.remove('active');
        modalContent.scrollTop = 0;
        modalContent.classList.remove('active');        
        document.body.style.overflow = '';      
        document.body.style.paddingRight = '';
        header.style.paddingRight = ''; 
        
        Array.from(document.body.children).forEach(item => {
            if (item !== modal) {
                item.inert = false;
            }
        });      
    };

    if (triggerSelector === 'show-product-btn') {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains(triggerSelector)) {
                e.preventDefault();
                openModal();
            }
        });
    } else {
        trigger.addEventListener('click', (e) => {
            if (e.target) {
                e.preventDefault();
            }
        openModal();
    }); 
    }

    

    document.addEventListener('click', (e) => {
        const target = e.target;        

        if (target === modal && modal.classList.contains('active') &&
            modalContent.classList.contains('active')) {
            closeModal();
        }        
    });

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('active') &&
            modalContent.classList.contains('active')) {
            closeModal();
            lastFocusedEl.focus();
        }
    });
    
    modalCloseBtn.addEventListener('click', () => {
        if (modal.classList.contains('active') && modalContent.classList.contains('active')) {
            closeModal();
            lastFocusedEl.focus();
        }
    });
}

//Marketing
export function showMarketing() {
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);

    if (viewportWidth >= 768) {
        const marketing = document.querySelector('.marketing');
        let marketingCounter = 0;
        let marketingDelay = 5000;

        const closeMarketing = () => {
            marketing.classList.remove('active');
        };

        const changeMarketingData = () => {            
            closeMarketing();

            setTimeout(() => {
                marketing.classList.add('active');
            }, marketingDelay - 3000);

            fetch('https://fpigletov-db.herokuapp.com/impulse/')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    let item = data.products[marketingCounter];

                    marketing.querySelector('.marketing__image img').setAttribute('src', `${item.mainImageJpg}`);
                    marketing.querySelector('.marketing__image img').setAttribute('alt', `${item.mainImageAlt}`);
                    marketing.querySelector('.marketing__customer-name').textContent = `${item.customerName}`;
                    marketing.querySelector('.marketing__title').setAttribute('data-show-id', `${item.id}`);
                    marketing.querySelector('.marketing__title').textContent = `${item.title}`;
                    marketing.querySelector('.marketing__subtitle').textContent = `${item.subtitle}`;
                    marketing.querySelector('.marketing__when').textContent = `${item.when}`;
                    marketing.querySelector('.marketing__where').textContent = `${item.where}`;
                });

            marketingCounter++;

            if (marketingCounter === 3) {
                marketingCounter = 0;
            }
        };

        changeMarketingData();

        const setMarketingInterval = setInterval(changeMarketingData, marketingDelay);

        marketing.addEventListener('click', (e) => {
            if (e.target.classList.contains('marketing__close')) {
                closeMarketing();
                clearInterval(setMarketingInterval);
            }
        });
    }
}

//Tabs
export function actionsOnTabs(parentSelector, tabsSelector, contentSelector, tabClass) {

        const tabsParent = document.querySelector(parentSelector);
        const tabs = document.querySelectorAll(tabsSelector);        
        const tabsContents = document.querySelectorAll(contentSelector);
    
        function showContent(index = 0) {
            tabsContents[index].classList.add('show', 'fade');
            tabsContents[index].classList.remove('hide');
            tabs[index].classList.add('active');

            if (parentSelector === '.checkout__tabs') {
                const tabsInputs = tabsContents[index].querySelectorAll('[data-name]');
                tabsInputs.forEach(item => {
                    const value = item.getAttribute('data-name'); 
                    item.setAttribute('name', `${value}`);
                    if (item.hasAttribute('data-validate-field')) {
                        item.setAttribute('data-validate-field', `${value.toLowerCase()}`);
                    }
                });
            }
        }

        function hideContent() {
            tabsContents.forEach(content => {
                content.classList.add('hide');
                content.classList.remove('show', 'fade');

                if (parentSelector === '.checkout__tabs') {
                    const tabsInputs = content.querySelectorAll('[data-name]');
                    tabsInputs.forEach(item => { 
                        item.removeAttribute('name');
                        if (item.hasAttribute('data-validate-field')) {
                            item.setAttribute('data-validate-field', '');
                        }
                    });
                }
            });

            tabs.forEach(tab => tab.classList.remove('active'));
        }

        hideContent();
        showContent();
        

        tabsParent.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains(tabClass)) {
                tabs.forEach((tab, index) => {
                    if (event.target === tab) {                    
                        hideContent();
                        showContent(index);
                    }
                });
            }
        });        
    } 

//Smooth Scroll
export function smoothScroll() {
    function scrollTo(element) {
        window.scroll({
            left: 0,
            top: element.offsetTop,
            behavior: 'smooth'
        });
    }

    const deliveryBtn = document.querySelector('#delivery');
    const footer = document.querySelector('footer');
    const reviewBtn = document.querySelector('#reviews');
    const reviews = document.querySelector('.reviews');

    deliveryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollTo(footer);
    });

    if (reviews) {
        reviewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollTo(reviews);
        });
    }
}

//Search
export function searchLogic() {
    
    const selectBtn = document.querySelector('.search__label');
    const searchBody = document.querySelector('.categories-search');
    const checkboxes = document.querySelectorAll('.categories-search__checkbox');
    const selectedCategory = document.querySelector('[data-selected]');
    const searchInput = document.querySelector('.search__input input');
    const searchIcon = document.querySelectorAll('.search__icon');
    const submitSearchForm = document.querySelector('.search');
    const searchResultBody = document.querySelector('.search-result');

    selectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchIcon[1].classList.toggle('active');
        slideToggle(searchBody);
    });

    function searchBodyActions() {
        searchIcon[1].classList.remove('active');
        slideUp(searchBody);
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            searchBodyActions();
        }
    });

    searchInput.addEventListener('click', () => {
        searchBodyActions();
    });

    checkboxes.forEach(item => {
        item.addEventListener('change', () => {
            item.classList.toggle('active');
            const activeCheckbox = document.querySelectorAll('.categories-search__checkbox.active');
            const checkboxNumber = activeCheckbox.length;
            selectedCategory.textContent = `Выбрано ${activeCheckbox.length}`;
            if (checkboxNumber === 0) {
                selectedCategory.textContent = 'Везде';
            }
        });
    });

    searchInput.addEventListener('input', () => {
        searchInput.value = searchInput.value.replace(/[^a-z|^а-я|^0-9|^-]/i, '');        
    });

    submitSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();

        search(searchInput.value);
        searchInput.value = '';
    });

    function falseResult() {
        searchResultBody.innerHTML = `
            <h2 class="search-result__title title">Результаты поиска:</h2>
            <div class="search-result__false">Ничего не найдено</div>
        `;
    }
    
    function search(text) {    
        
        if (text === '') {

            falseResult();

        } else { 

            searchResultBody.innerHTML = `
                <h2 class="search-result__title title">Результаты поиска:</h2>
                <ol class="search-result__list"></ol>
            `;

            const results = document.querySelector('.search-result__list');

            fetch('https://fpigletov-db.herokuapp.com/impulse/')
                .then(response => response.json())
                .then((data) => {

                    const searchResults = data.products;
                    
                    const filteredResults = searchResults.filter(item => {
                        return item.title.toLowerCase().includes(text.toLowerCase()) || item.subtitle.toLowerCase().includes(text.toLowerCase());
                    });

                    if (filteredResults.length > 0) {

                        filteredResults.forEach(item => {

                            results.innerHTML += `                                
                                <li class="search-result__item">
                                    <a data-show-id=${item.id} href="#" class="search-result__link show-product-btn">${item.title}</a>
                                </li>                        
                            `;
                        });

                    } else {

                        falseResult();
                        
                    }
                });
        }        
    }
}


