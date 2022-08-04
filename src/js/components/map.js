'use strict';

export function maps() {
    if (document.querySelector('.contacts')) {
        
        const init = () => {
            // Создание карты.
            const myMap = new ymaps.Map("map", {
                center: [55.76, 37.64],
                
                zoom: 11
            });
            
            const myPlacemark = new ymaps.Placemark([55.763310, 37.677831], null, {
	        preset: "default#lightbluePoint"
            });
            myMap.geoObjects.add(myPlacemark);
        };

        ymaps.ready(init);
    }
    
}