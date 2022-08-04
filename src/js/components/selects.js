'use strict';

export function choiceSelect() {
    //Selects
    const actionsSelect = document.querySelector('.actions-catalog__select');
    const naviSelect = document.querySelector('.navi-catalog__select');
    const moscowSelect = document.querySelector('.tab-block__select_moscow');
    const regionSelect = document.querySelector('.tab-block__select_region');

    if (actionsSelect) {
        const actionChoices = new Choices(actionsSelect, {
            shouldSort: false,
            position: 'bottom',
            searchEnabled: false,
        });
    }

    if (naviSelect) {
        const naviChoices = new Choices(naviSelect, {
            shouldSort: false,
            position: 'bottom',
            searchEnabled: false,
        });
    }

    if (moscowSelect) {
        const moscowChoices = new Choices(moscowSelect, {
            shouldSort: false,
            position: 'bottom',
            searchEnabled: false,
        });
    }

    if (regionSelect) {
        const regionChoices = new Choices(regionSelect, {
            shouldSort: false,
            position: 'bottom',
            searchEnabled: false,
        });
    }
}