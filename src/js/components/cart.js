'use strict';

export function cartLogic() {
    const cartList = document.querySelector('.cart-content__list');
    const checkout = document.querySelector('.checkout');
    const cartQuantity = document.querySelector('.info-header__cart span');
    const cartBody = document.querySelector('.info-header__cart-body');

    //Convert to Normal Price
    function normalPrice(str) {
        return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    }

    //Remove Spaces in Price
    function priceWithoutSpaces(str) {
        return str.replace(/\s/g, '');
    }

    // Local Storage
    function updateStorage() {
        let cartListContent = cartList.innerHTML;
        localStorage.setItem('products', cartListContent);          
    }

    function currentStorageState() {
        if (localStorage.getItem('products') !== null) {
            cartList.innerHTML = localStorage.getItem('products');
        } 
    }
    
    currentStorageState();

    function showCartQuantity() {      
        const cartItem = document.querySelector('.cart-content__item');
        const cartProductQuantity = document.querySelectorAll('.cart-content__quantity span');        
        let totalQuantity = 0;

        if (cartItem) {
            cartProductQuantity.forEach(item => {
                totalQuantity += +item.textContent;
            });

            cartQuantity.textContent = totalQuantity;

            if (cartList.children.length > 0) {
                cartQuantity.classList.add('active');  
                cartBody.classList.add('active');
            } else {
                cartQuantity.classList.remove('active');  
                cartBody.classList.remove('active');
            }   
            
            if (checkout) {
                cartBody.classList.remove('active');
            }
        }
    }

    showCartQuantity();

    //Count Cart Total
    function countCartTotal() {
        const cartProductPrice = document.querySelectorAll('.cart-content__price');
        const cartTotalPrice = document.querySelector('.cart-content__total span');
        const total = [];  
        
        cartProductPrice.forEach(item => {            
            total.push(parseInt(priceWithoutSpaces(item.textContent))); 
        });

        if (total.length > 0) {
            cartTotalPrice.textContent = normalPrice(total.reduce((a, b) => a + b));
        }
    }

    countCartTotal();

    //Flying Product
    function addToCart(currentBtn, id, parent) {
        if (!currentBtn.classList.contains('hold')) {
            currentBtn.classList.add('hold');
            currentBtn.classList.add('fly');
            
            const cart = document.querySelector('.info-header__cart');
            const product = parent.querySelector(`.item-product[data-id="${id}"]`);
            const cartProductImage = product.querySelector('.item-product__image img');

            const productImageFly = cartProductImage.cloneNode(false);            

            const productImageFlyWidth = cartProductImage.offsetWidth;
			const productImageFlyHeight = cartProductImage.offsetHeight;
			const productImageFlyTop = cartProductImage.getBoundingClientRect().top;
            const productImageFlyLeft = cartProductImage.getBoundingClientRect().left; 

            productImageFly.setAttribute('class', 'flyImage');
			productImageFly.style.cssText =	`
				left: ${productImageFlyLeft}px;
				top: ${productImageFlyTop}px;
				width: ${productImageFlyWidth}px;
				height: ${productImageFlyHeight}px;
			`;

            document.body.append(productImageFly);

            const cartFlyLeft = cart.getBoundingClientRect().left;
			const cartFlyTop = cart.getBoundingClientRect().top;

			productImageFly.style.cssText =	`
				left: ${cartFlyLeft}px;
				top: ${cartFlyTop}px;
				width: 0px;
				height: 0px;
				opacity: 0;
			`;

            productImageFly.addEventListener('transitionend', () => {
				if (currentBtn.classList.contains('fly')) {
					productImageFly.remove();
					updateCart(currentBtn, id);
					currentBtn.classList.remove('fly');
				}
			});	
        }
    }

    //Add Product to Cart 
    function updateCart(currentBtn, id, productAdd = true) {        
		const cartIcon = cartBody.querySelector('.info-header__cart');
		const cartQuantity = cartIcon.querySelector('span');
        const cartProduct = document.querySelector(`[data-cart-id="${id}"]`);   
        
        fetch('https://fpigletov-db.herokuapp.com/impulse/')
            .then((response) => {
                return response.json();
            })
            .then((data) => {
            
                for (let dataItem of data.products) {
                    if (dataItem.id == id) {
                        //Add Product
                        if (productAdd) {
                            if (!cartProduct) {
                                cartList.insertAdjacentHTML('beforeend', `
                                <li class="cart-content__item" data-cart-id="${dataItem.id}">
                                    <a href="#" class="cart-content__image">
                                        <img src="${dataItem.mainImageJpg}" alt="${dataItem.mainImageAlt}">
                                    </a>
                                    <div class="cart-content__info">
                                        <a href="#" class="cart-content__title">                            
                                            <span>${dataItem.title}</span>
                                            <div class="cart-content__subtitle">${dataItem.subtitle}</div>                            
                                        </a>
                                        <div class="cart-content__price icon-ruble-sign-solid">${normalPrice(dataItem.price)}</div>
                                    </div>
                                    <div class="cart-content__quantity"><span>1</span></div>
                                    <button type="button" class="cart-content__remove icon-trash-can-solid" aria-label="Удалить товар"></button>
                                </li>
                            `);
                            } else {
                                //Add Product Quantity and Price
                                const cartProductQuantity = cartProduct.querySelector('.cart-content__quantity span');
                                const cartProductPrice = cartProduct.querySelector('.cart-content__price');
                            
                                cartProductQuantity.textContent = ++cartProductQuantity.textContent;
                                cartProductPrice.textContent = normalPrice(+cartProductQuantity.textContent * `${dataItem.price}`);
                            }

                            //Unhold Button
                            currentBtn.classList.remove('hold');

                        } else {    //Remove Product	
                            const cartProductQuantity = cartProduct.querySelector('.cart-content__quantity span');
                            const cartProductPrice = cartProduct.querySelector('.cart-content__price');
                            cartProductQuantity.textContent = --cartProductQuantity.textContent;

                            //Total Product Price
                            cartProductPrice.textContent = normalPrice(+cartProductQuantity.textContent * `${dataItem.price}`);
                        
                            //Remove Cart Product
                            if (!parseInt(cartProductQuantity.textContent)) {
                                cartProduct.remove();
                            }

                            cartQuantity.textContent = --cartQuantity.textContent;
                        }

                        countCartTotal();
        
                        updateStorage();

                        showCartQuantity();

                        if (cartList.children.length > 0) {
                            cartQuantity.classList.add('active');
                            cartBody.classList.add('active');
                        } else {
                            cartQuantity.classList.remove('active');
                            cartBody.classList.remove('active');
                        }
                    }
                }
            });
    }

    document.addEventListener('click', (e) => {
        
        const target = e.target;
        
        if (target.classList.contains('add-btn')) {
            e.preventDefault();
            const productId = target.dataset.btnId;
            
            if (target.closest('[data-submenu]')) {
                const submenuItem = document.querySelector(`[data-submenu="${productId}"]`);
                addToCart(target, productId, submenuItem);  
            } else if (target.closest('.product-items')) {
                const productItemsBody = document.querySelector('.product-items');            
                addToCart(target, productId, productItemsBody);
            }
            
        }

        if (target.classList.contains('cart-content__remove')) {
            const productId = target.closest('.cart-content__item').dataset.cartId;
            updateCart(target, productId, false);
        }

        if (target.classList.contains('cart-content__btn') || target.classList.contains('info-header__cart')) {
            addToCheckout();
        }
    });

    //Add Cart to Checkout

    //Genetare Checkout Item
    function generateCheckoutItem(img, alt, title, subtitle, value, price, totalPrice, id) {

        return `<li class="order-checkout__item item-checkout" data-checkout-id="${id}">
                    <div class="item-checkout__top">
                        <button type="button" class="item-checkout__close icon-xmark-solid" aria-label="Удалить товар"></button>
                    </div>
                    <div class="item-checkout__wrapper">
                        <div class="item-checkout__content">
                            <a href="#" class="item-checkout__image">
                                <img src="${img}" alt="${alt}">
                            </a>
                            <div class="item-checkout__descr">
                                <a href="#" class="item-checkout__title">
                                    <span>${title}</span>
                                    <div class="item-checkout__subtitle">${subtitle}</div>
                                </a>
                                <div class="item-checkout__price icon-ruble-sign-solid">
                                    ${normalPrice(price)}
                                </div>
                            </div>
                        </div>
                        <div class="item-checkout__info">
                            <div class="item-checkout__quantity quantity">
                                <button type="button" class="quantity__btn quantity__btn_minus icon-circle-left-solid" aria-label="Удалить товар"></button>
                                <div class="quantity__current-number">
                                    <input autocomplete="off"  placeholder="1" type="number" class="quantity__input" value="${value}" max="99">
                                </div>
                                <button type="button" class="quantity__btn quantity__btn_plus icon-circle-right-solid" aria-label="Добавить товар"></button>
                            </div>
                            <div class="item-checkout__total">
                                <div class="item-checkout__tag">Всего:</div>
                                <span>${totalPrice}</span>
                                <div class="item-checkout__icon icon-ruble-sign-solid"></div>
                            </div>                            
                        </div>
                    </div>                    
                </li>`;
        
    }

    function changeCheckoutContent() {
        const checkoutContent = checkout.querySelector('.order-checkout');

        checkoutContent.innerHTML = `
            <div class="order-checkout__empty empty-checkout">
                <div class="empty-checkout__text title">Ваша корзина пуста</div>
                <div class="empty-checkout__link">Перейти в <a href="catalog.html">Каталог</a></div>
            </div>
        `;
    }

    function addToCheckout() {
        if (cartList.children.length > 0) {
            if (checkout) {
                const cartProduct = cartList.querySelectorAll('.cart-content__item');
                const cartTotalPrice = document.querySelector('.cart-content__total span');
                const checkoutProductsBody = checkout.querySelector('.order-checkout__items');
                const checkoutTotalPrice = checkout.querySelector('.order-checkout__total span');

                cartProduct.forEach(item => {
                    const cartId = item.dataset.cartId;
                    const cartImg = item.querySelector('.cart-content__image img').getAttribute('src');
                    const cartAlt = item.querySelector('.cart-content__image img').getAttribute('alt');
                    const cartTitle = item.querySelector('.cart-content__title span').textContent.trim();
                    const cartSubtitle = item.querySelector('.cart-content__subtitle').textContent.trim();
                    const cartQuantity = item.querySelector('.cart-content__quantity span').textContent;
                    const cartPrice = normalPrice(priceWithoutSpaces(item.querySelector('.cart-content__price').textContent) / cartQuantity);
                    const cartTotalPrice = item.querySelector('.cart-content__price').textContent;                    

                    checkoutProductsBody.insertAdjacentHTML('beforeend', generateCheckoutItem(cartImg, cartAlt, cartTitle, cartSubtitle, cartQuantity, cartPrice, cartTotalPrice, cartId));
                });

                checkoutTotalPrice.textContent = cartTotalPrice.textContent;
            }

        } else {
            if (checkout) {
                changeCheckoutContent();                
            }            
        }
    }

    addToCheckout();

     //-----------------------Stepper(Checkout,Product)---------------------------------------

    function stepperWork(parent) {
        const stepperBody = parent;
        const stepperInput = stepperBody.querySelector('.quantity__input');
        const plusBtn = stepperBody.querySelector('.quantity__btn_plus');
        const minusBtn = stepperBody.querySelector('.quantity__btn_minus');

        stepperInput.addEventListener('keydown', (e) => {
            if (e.currentTarget.value <= 1) {
                minusBtn.classList.add('disabled');
                plusBtn.classList.remove('disabled');
            } else {
                minusBtn.classList.remove('disabled');
            }

            if (e.currentTarget.value >= 99) {
                minusBtn.classList.remove('disabled');
                plusBtn.classList.add('disabled');
            } else {
                plusBtn.classList.remove('disabled');
            }
        });

        stepperInput.addEventListener('input', () => {
            if (stepperInput.value.length > 2) {
                stepperInput.value = stepperInput.value.slice(0, 2);
            }

            if (stepperInput.value < 1) {
                stepperInput.value = 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            stepperInput.value++;
            minusBtn.classList.remove('disabled');

            if (stepperInput.value >= 99) {
                stepperInput.value = 99;
                plusBtn.classList.add('disabled');
            } else {
                plusBtn.classList.remove('disabled');
            }            
        });

        minusBtn.addEventListener('click', () => {
            stepperInput.value--;
            plusBtn.classList.remove('disabled');

            if (stepperInput.value <= 1) {
                stepperInput.value = 1;
                minusBtn.classList.add('disabled');
            } else {
                minusBtn.classList.remove('disabled');
            }
        });
    }

    //Stepper Checkout Product
    if (checkout) {
        
        const checkoutTotalPrice = checkout.querySelector('.order-checkout__total span');
        const checkoutProductsBody = document.querySelector('.order-checkout__items');

        if (checkoutProductsBody) {
        
            const checkoutProducts = checkoutProductsBody.querySelectorAll('.item-checkout');
            
            checkoutProducts.forEach(item => {
                stepperWork(item);
                
                const checkoutProductQuantity = item.querySelector('.quantity__input');
                const checkoutProductTotal = item.querySelector('.item-checkout__total span');
                const checkoutProductPrice = item.querySelector('.item-checkout__price');
                const checkoutProductBtns = item.querySelectorAll('.quantity__btn');  
                const checkoutCloseBtns = item.querySelectorAll('.item-checkout__close');  
                const checkoutProductId = item.dataset.checkoutId;
                const cartProduct = cartList.querySelector(`[data-cart-id="${checkoutProductId}"]`);
                const cartProductQuantity = cartProduct.querySelector('.cart-content__quantity span');
                const cartProductPrice = cartProduct.querySelector('.cart-content__price'); 
                
                const updateTotalPrice = () => {
                    checkoutProductTotal.textContent = normalPrice(priceWithoutSpaces(checkoutProductPrice.textContent) * checkoutProductQuantity.value); 
                    

                    cartProductQuantity.textContent = checkoutProductQuantity.value;
                    cartProductPrice.textContent = checkoutProductTotal.textContent;

                    //Total Checkout Price
                    const checkoutItemTotal = checkout.querySelectorAll('.item-checkout__total span');                
                    const total = Array.from(checkoutItemTotal).map(el => +priceWithoutSpaces(el.textContent)).reduce((a, b) => a + b);
                    checkoutTotalPrice.textContent = normalPrice(total);

                    //Total Cart Quantity
                    const checkoutQuantity = checkout.querySelectorAll('.quantity__input'); 
                    const totalQuantity = Array.from(checkoutQuantity).map(el => +el.value).reduce((a, b) => a + b);
                    cartQuantity.textContent = totalQuantity;               

                    updateStorage(); 
                };

                checkoutProductQuantity.addEventListener('input', updateTotalPrice);

                checkoutProductBtns.forEach(btn => {
                    btn.addEventListener('click', updateTotalPrice);
                }); 

                checkoutCloseBtns.forEach(el => {
                    el.addEventListener('click', () => {
                        item.remove();
                        cartProduct.remove();

                        updateStorage();  

                        cartQuantity.textContent -= +checkoutProductQuantity.value;

                        checkoutTotalPrice.textContent = normalPrice(priceWithoutSpaces(checkoutTotalPrice.textContent) - priceWithoutSpaces(checkoutProductTotal.textContent));

                        if (checkoutProductsBody.children.length < 1) {
                            changeCheckoutContent();
                            cartQuantity.classList.remove('active');
                        }
                    });
                });
            });
        }
    }

     //Stepper Product
    if (document.querySelector('.product-item')) {
        const productQuantity = document.querySelector('.info-product__quantity');
        stepperWork(productQuantity);
    }

}