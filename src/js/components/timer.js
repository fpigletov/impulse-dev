'use strict';

export function timer() {
    const deadline = '2022-12-31';

    function getTimeRemaining(endtime) {
        const totalMs = Date.parse(endtime) - Date.parse(new Date());
        const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
        const seconds = Math.floor((totalMs / 1000) % 60);

        return {
            'total': totalMs,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    function showZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setTimer(selector, endtime) {
        const timer = document.querySelector(selector);
        const days = timer.querySelector('.slider-timer__days');
        const hours = timer.querySelector('.slider-timer__hours');
        const minutes = timer.querySelector('.slider-timer__minutes');
        const seconds = timer.querySelector('.slider-timer__seconds');
        const timeInterval = setInterval(updateTimer, 1000);

        updateTimer();

        function updateTimer() {
            const timeLeft = getTimeRemaining(endtime);

            days.textContent = showZero(timeLeft.days);
            hours.textContent = showZero(timeLeft.hours);
            minutes.textContent = showZero(timeLeft.minutes);
            seconds.textContent = showZero(timeLeft.seconds);

            if (timeLeft <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setTimer('[data-slide="0"] .slider-timer__body', deadline);
    setTimer('[data-slide="1"] .slider-timer__body', deadline);    
}