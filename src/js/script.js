'use strict';

import { sliders } from './components/sliders';
import { burgerMenu } from './components/modules';
import { loadingProducts } from './components/products';
import { modal } from './components/modules';
import { showMarketing } from './components/modules';
import { slideToggle } from './components/modules';
import { slideUp } from './components/modules';
import { actionsOnTabs } from './components/modules';
import { smoothScroll } from './components/modules';
import { cartLogic } from './components/cart';
import { timer } from './components/timer';
import { formValidation } from './components/validate';
import { maps } from './components/map';
import { choiceSelect } from './components/selects';
import { searchLogic } from './components/modules';

window.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('.side-link');
    const sideBurgerBtn = document.querySelector('.side-menu__burger');
    const sideBody = document.querySelector('.side-menu__body');
    const sideMenu = document.querySelector('.central__menu');   
    const checkout = document.querySelector('.checkout');
    const topHeaderBody = document.querySelector('.top-header__body');
    const headerBurger = document.querySelector('.top-header__burger');
    
    //Sliders
    sliders();

    //Header Burger
    burgerMenu('.top-header__burger', '.top-header__body', '.top-header__item');
    
    //Header-On-Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            document.querySelector('.header').classList.add('active');
        } else {
            document.querySelector('.header').classList.remove('active');
        }
    });

    //Modals
    modal('#registration', '.modal__form_registration');
    modal('#login', '.modal__form_login');
    modal('#callback', '.modal__form_callback');

    //Preloader
    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.querySelector('.preloader');
            if (!preloader.classList.contains('done')) {
                preloader.classList.add('done');
            }
        }, 500);
    });


    // Side Menu
    menuLinks.forEach(item => {

        const actionsOnClick = () => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                menuLinks.forEach(item => {
                    if (item !== e.currentTarget) {
                        item.classList.remove('active');
                    }
                });
                e.currentTarget.classList.toggle('active');
            });
        };

        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            actionsOnClick();
        } else {
            item.addEventListener('mouseover', (e) => {
                e.preventDefault();
                item.classList.add('active');
            });

            item.addEventListener('mouseout', (e) => {
                e.preventDefault();
                item.classList.remove('active');
            });

            actionsOnClick();
        }
    });

    //Side Burger 
    sideBurgerBtn.addEventListener('click', (e) => {
        sideBurgerBtn.classList.toggle('active');
        
        slideToggle(sideBody);

        menuLinks.forEach(item => {
            item.classList.remove('active');
        });   
        
        let ariaLabel = sideBurgerBtn.getAttribute('aria-label');
        if (ariaLabel === 'Открыть меню') {
            sideBurgerBtn.setAttribute('aria-label', 'Закрыть меню');
        } else {
            sideBurgerBtn.setAttribute('aria-label', 'Открыть меню');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            menuLinks.forEach(item => {

                if (item.classList.contains('active') && sideBurgerBtn.classList.contains('active')) {
                    
                    item.classList.remove('active');

                } else if (!item.classList.contains('active') && sideBurgerBtn.classList.contains('active')) {

                    slideUp(sideBody);
                    sideBurgerBtn.classList.remove('active');
                }
            });
        }
    });

    document.addEventListener('click', (e) => {
        const target = e.target;
        const menuBlock = target.closest('.central__menu');

        if (!document.contains(menuBlock) && sideBurgerBtn.classList.contains('active')) {
            sideBurgerBtn.classList.remove('active');
            slideUp(sideBody);
        }

        if (target.closest('.info-header__callback') || target.classList.contains('actions-header__label')) {
            if (topHeaderBody.classList.contains('active')) {
                topHeaderBody.classList.remove('active');
            }

            if (headerBurger.classList.contains('active')) {
                headerBurger.classList.remove('active');
            }
        }
    });

    //Dinamic Adaptive

    //Header
    const headerInfoBlock = document.querySelector('.contacts-header__info');
    const headerMenu = document.querySelector('.top-header__menu');
    const contactsHeaderBlock = document.querySelector('.contacts-header');
    const contactsHeaderItem = document.querySelector('.contacts-header__item_left');
    const cartBody = document.querySelector('.info-header__cart-body');    
    const bottomHeaderInfo = document.querySelector('.bottom-header__info');
    const headerInfoColumns = document.querySelectorAll('.info-header__column');    
    const rightBottomColumn = document.querySelector('.bottom-header__column_right');
    const actionsLinks = document.querySelectorAll('.actions-header__link');
    const actionsItems = document.querySelectorAll('.actions-header__item');
    const contactsIcon = document.querySelector('.contacts-header__icon');

    //News & Reviews
    const sideNews = document.querySelector('.central__news');
    const sideReviews = document.querySelector('.central__reviews');
    const centralContent = document.querySelector('.central__content');

    //Filter   
    const filterBlock = document.querySelector('.central__filter');
    const catalogTitle = document.querySelector('.catalog-items__title');
    const filterTitle = document.querySelector('.filter__title');
    const filterIcon = document.querySelector('.filter__title-icon');

    //Footer
    const payments = document.querySelector('.top-footer__payments');
    const deliveryBlock = document.querySelector('.top-footer__delivery');
    const footerColumn = document.querySelector('[data-footer-column]'); 

    function dinamicAdaptive() {
        const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);

        //Header
        if (viewportWidth <= 992) {
            headerMenu.append(headerInfoBlock);
            contactsHeaderBlock.append(cartBody);
        } else {
            contactsHeaderItem.append(headerInfoBlock);
            headerInfoColumns[2].append(cartBody);
        }

        if (viewportWidth <= 768) {
            topHeaderBody.append(bottomHeaderInfo);
        } else {
            rightBottomColumn.append(bottomHeaderInfo);
        }

        if (viewportWidth <= 600) {
            headerInfoColumns[2].append(actionsLinks[2]);
            actionsItems[2].append(contactsIcon);
        } else {
            actionsItems[2].append(actionsLinks[2]);
            contactsHeaderItem.prepend(contactsIcon);
        }

        //News & Reviews
        if (viewportWidth <= 992) {            
            centralContent.append(sideNews, sideReviews);  
        } else {
            sideMenu.after(sideNews, sideReviews);    
        }

        //Filter
        if (filterBlock) {
            if (viewportWidth <= 992) {            
            catalogTitle.after(filterBlock);
            } else {            
                sideMenu.after(filterBlock);  
            }    

            if (viewportWidth <= 992) {
                filterTitle.addEventListener('click', (e) => {
                    slideToggle(filterTitle.nextElementSibling);
                    filterIcon.classList.toggle('active');
                });
            }
        }

        //Footer
        if (viewportWidth <= 1200) {
            deliveryBlock.append(payments);
            
        } else {
            footerColumn.append(payments);
        }

    }

    window.addEventListener('resize', () => {
        //Adaptiv
        dinamicAdaptive();

        //Marketing
        showMarketing();
    }); 

    window.addEventListener('load', () => {
        //Adaptiv
        dinamicAdaptive();

        //Marketing
        showMarketing();
    });
    

    //Loading Products To Catalog
    loadingProducts();

    //Filter Sections
    const filterTitles = document.querySelectorAll('[data-filter]');
    const catalogItems = document.querySelector('.catalog-items');

    if (filterTitles) {
        filterTitles.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget;                             

                filterTitles.forEach(el => {
                    if (el !== target) {
                        slideUp(el.nextElementSibling); 
                        el.classList.remove('active');
                    }
                    slideToggle(target.nextElementSibling);
                });

                item.classList.toggle('active');   
            });
        });
    }

    //Choice Block    
    const filterItems = document.querySelectorAll('.section-filter__item');
    const catalogChoice = document.querySelector('.catalog-items__choice');
    const catalogChoiceWrapper = document.querySelector('.choice-catalog__wrapper');
    const filterCheckboxes = document.querySelectorAll('.section-filter__label'); 
    //Filter Form
    const filterForm = document.querySelector('.filter__form');
    const resetBtn = document.querySelector('.filter__reset-btn');
    
    if (filterBlock) {
        const createChoiceItem = (text) => {
            return (
                `
                <div class="choice-catalog__item icon-xmark-solid" data-filter="${text}">${text}</div>
                `
            );            
        };

        filterItems.forEach(item => {
            item.querySelector('input').addEventListener('change', (event) => {
                let checkedItem = item.querySelector('input').checked;
                
                if (checkedItem) {
                    item.querySelector('.section-filter__label').classList.add('checkbox-active');
                    let choiceItemText = item.querySelector('.section-filter__text').textContent;
                    catalogChoiceWrapper.insertAdjacentHTML('afterbegin', createChoiceItem(choiceItemText));
                } else {
                    item.querySelector('.section-filter__label').classList.remove('checkbox-active');
                    let filterItemText = item.querySelector('.section-filter__label').dataset.filter;
                    catalogChoiceWrapper.querySelector(`[data-filter="${filterItemText}"]`).remove(); 
                }

                let activeCheckboxes = document.querySelectorAll('.checkbox-active');

                if (activeCheckboxes.length > 0) {
                    catalogChoice.style.display = 'block';
                } else {
                    catalogChoice.style.display = '';
                }
            });
        });  
        
        filterCheckboxes.forEach((item) => {
            const filterText = item.textContent.trim();        
            item.setAttribute('data-filter', `${filterText}`);
        });

        catalogChoiceWrapper.addEventListener('click', (event) => {
            if (event.target.classList.contains('choice-catalog__item')) {
                event.target.remove();

                let choiceItemText = event.target.dataset.filter;            

                document.querySelector(`[data-filter="${choiceItemText}"]`).querySelector('input').checked = false;
                document.querySelector(`[data-filter="${choiceItemText}"]`).classList.remove('checkbox-active');
            }

            if (event.target.classList.contains('choice-catalog__clear')) {
                Array.from(event.currentTarget.children).forEach(item => {                
                    if (!item.classList.contains('choice-catalog__clear')) {
                        item.remove();
                    }

                    filterItems.forEach(item => {                    
                        item.querySelector('input').checked = false;
                        item.querySelector('.section-filter__label').classList.remove('checkbox-active');
                    });
                });   

                catalogChoice.style.display = 'none';
            }

            if (event.currentTarget.children.length === 1) {
                catalogChoice.style.display = 'none';
            }
        });

        
        //Clear Filter Form
        resetBtn.addEventListener('click', () => {
            filterForm.reset();
            Array.from(catalogChoiceWrapper.children).forEach(item => {
                if (!item.classList.contains('choice-catalog__clear')) {
                        item.remove();
                }
            });

            catalogChoice.style.display = 'none';
        });
    }
    
    //Tabs Checkout   
    if (checkout) {
        actionsOnTabs('.checkout__tabs', '.checkout__tab-btn', '.checkout__tab-block', 'checkout__tab-btn');
    }

    //Tabs Product 
    if (document.querySelector('.product')) {        
        actionsOnTabs('.descr-product__tabs', '.descr-product__tab-btn', '.descr-product__text', 'descr-product__tab-btn');
    } 
    
    //Cart and Checkout
    // cartActions();
    cartLogic();
    
    //Timer
    if (document.querySelector('.central-slider')) {
        timer();
    }    

    //All Forms
    formValidation();    

    //Map
    maps();

    //Smooth Scroll
    smoothScroll();
    
    //Selects
    choiceSelect();

    //Search
    searchLogic();
});


