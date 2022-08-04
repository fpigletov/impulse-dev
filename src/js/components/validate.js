'use strict';

export function formValidation() {
    const modal = document.querySelector('.modal');
    const modalMessage = modal.querySelector('.modal__message');    
    const wrapper = document.querySelector('.wrapper');
    const checkoutItems = document.querySelectorAll('.item-checkout');
    const cartList = document.querySelector('.cart-content__list');
    const cartItems = document.querySelectorAll('.cart-content__item');
    const cartQuantity = document.querySelector('.info-header__cart span');

    //Inputmask    
    const selector = document.querySelectorAll('input[type="tel"]');
    const inputMask = new Inputmask('+7 (999) 999-99-99');
    inputMask.mask(selector);

    //Close Modal With Delay
    const closeModalWithDelay = (delay) => {
        setTimeout(() => {
            modal.classList.remove('active');
            modalMessage.classList.remove('active');
            wrapper.classList.remove('blur');
            document.body.style.overflow = '';
            modalMessage.textContent = '';
        }, delay);
    };

    //Create Random Number
    const randomNumber = Math.random().toString().slice(2, 10);
    
    //Status Messages
    const statusMessage = {
        checkoutSuccess: `Заказ №${randomNumber} успешно оформлен. 
        Спасибо, что выбрали наш магазин`,
        registrationSuccess: 'Вы зарегистрированы!',
        callbackSuccess: 'Наш оператор скоро с Вами свяжется!',
        fail: 'Произошла ошибка. Попробуйте снова',
        loading: 'Операция обрабатывается'
    };

    //POST
    const postData = async (url, data, contentSelector) => {
        document.querySelector(contentSelector).classList.remove('active');
        
        if (!modal.classList.contains('active')) {
            modal.classList.add('active');
        }
        
        modalMessage.classList.add('active');
        modalMessage.textContent = statusMessage.loading;

        let result = await fetch(url, {
            method: 'POST',
            body: data
        });

        return await result.text();
    };

    //Validate And Post Forms    
    function validateForms(formSelector, rules, messages, url, delay, successMessage) {

        new window.JustValidate(formSelector, {
            rules: rules,
            colorWrong: '#ee2c2d',
            messages: messages,
            submitHandler: function (form) {
                let formData = new FormData(form);

                postData(url, formData, formSelector)
                    .then((data) => {
                        modalMessage.textContent = successMessage;
                        console.log('Отправлено');
                        console.log(data);
                    }).catch((data) => {
                        modalMessage.textContent = statusMessage.fail;
                        console.log(data);
                        console.log('Произошла ошибка. Попробуйте снова');
                    }).finally(() => {
                        form.reset();
                        closeModalWithDelay(delay);
                    });
            }
        });
    }

    //CallBack
    validateForms('.modal__form_callback',
        {
            phone: {
                required: true
            }
        },
        {
            name: {
                required: 'Введите Ваше имя',
                minLength: 'Минимум 3 символа',
                maxLength: 'Максимум 15 символов'
            },
            phone: {
                required: 'Введите Ваш телефон'
            }
        },
        'resources/mail.php', 5000, statusMessage.callbackSuccess);

    //Login
    validateForms('.modal__form_login',
        {
            login: {
                required: true
            },
            password: {
                required: true
            },
        },
        {
            login: {
                required: 'Введите Ваш логин',
            },
            password: {
                required: 'Введите Ваш пароль'
            }
        },
        'resources/server.php');

    //Registration
    validateForms('.modal__form_registration',
        {
            login: {
                required: true
            },
            password: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            phone: {
                required: true
            },
            agree: {
                required: true
            },
        },
        {
            login: {
                required: 'Введите Ваш логин',
            },
            password: {
                required: 'Введите Ваш пароль'
            },
            email: {
                required: 'Введите Ваш Email',
                email: 'Не правильный формат'
            },
            phone: {
                required: 'Введите Ваш телефон'
            },
            agree: {
                required: 'Поставьте галочку'
            }
        },
        'resources/server.php', 5000, statusMessage.checkoutSuccess);

    //Checkout Form
    const checkout = document.querySelector('.checkout');    

    if (checkout) {
        const checkoutTabs = checkout.querySelectorAll('.checkout__tab');
        const checkoutContent = checkout.querySelector('.order-checkout');

        const postCheckoutData = async (url, data) => {
            if (!modal.classList.contains('active')) {
                modal.classList.add('active');
            }
            modalMessage.classList.add('active');
            modalMessage.textContent = statusMessage.loading;

            let result = await fetch(url, {
                method: 'POST',
                body: data
            });

            return await result.text();
        };

        const clearCheckout = () => {
            checkoutItems.forEach(item => {
                item.remove(); 
            });

            cartItems.forEach(item => {
                item.remove();
            });

            let cartListContent = cartList.innerHTML;
            localStorage.setItem('products', cartListContent);             

            checkoutContent.innerHTML = `
                <div class="order-checkout__empty empty-checkout">
                    <div class="empty-checkout__text title">Ваша корзина пуста</div>
                    <div class="empty-checkout__link">Перейти в <a href="catalog.html">Каталог</a></div>
                </div>
            `;

            cartQuantity.textContent = 0;
            cartQuantity.classList.remove('active');
            window.scrollTo(0, 0);
        };        

        new window.JustValidate('.checkout', {            
            rules: {
                surname: {
                    required: true
                },
                name: {
                    required: true
                },
                secondname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                phone: {
                    required: true
                },
                index: {
                    required: true
                },
                city: {
                    required: true
                },
                address: {
                    required: true
                },
            },
            colorWrong: '#ee2c2d',
            messages: {
                surname: {
                    required: 'Введите Вашу фамилию',
                },
                name: {
                    required: 'Введите Ваше имя'
                },
                secondname: {
                    required: 'Введите Ваше отчество'
                },
                email: {
                    required: 'Введите Ваш Email',
                    email: 'Не правильный формат'
                },
                phone: {
                    required: 'Введите Ваш телефон'
                },
                index: {
                    required: 'Введите Ваш индекс'
                },
                city: {
                    required: 'Введите Ваш город'
                },
                address: {
                    required: 'Введите Ваш адрес'
                }
            },
            submitHandler: function (thisForm) { 
                let formData = new FormData(thisForm);

                let delivery = '';
                checkoutTabs.forEach(item => {
                    if (item.classList.contains('active')) {                        
                        delivery = item.textContent;
                    }
                });

                formData.append('Delivery', delivery);

                checkoutItems.forEach((item, index) => { 
                    let title = item.querySelector('.item-checkout__title span').textContent;
                    let quantity = item.querySelector('.quantity__input').value;
                    let price = item.querySelector('.item-checkout__price').textContent;
                    
                    formData.append(`Product-${index + 1}`, `${title}, quantity - ${quantity}, ${price}`);
                });
            
                formData.append(`Total`, `${document.querySelector('.order-checkout__total span').textContent}`);
                
                postCheckoutData('resources/mail.php', formData)
                .then((data) => {                
                    console.log('Отправлено');
                    console.log(data);
                    modalMessage.textContent = statusMessage.checkoutSuccess;
                    clearCheckout();
                }).catch(() => {
                    console.log('Произошла ошибка. Попробуйте снова');
                    modalMessage.textContent = statusMessage.fail;                    
                }).finally(() => {                
                    thisForm.reset();
                    closeModalWithDelay(5000);
                });                
            }
        });        
    }
}

