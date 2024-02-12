import toastr from 'https://cdn.jsdelivr.net/npm/toastr@2.1.4/+esm';

toastr.options = {
    "closeButton": true, // есть кнопка для закрытия уведомления
    "newestOnTop": true, // новые уведомления появляются выше
    "positionClass": "toast-bottom-left", // позиция уведомления на экране
    "timeOut": "2000", // время жизни уведомления
    "extendedTimeOut": "500", // время жизни уведомления после клика на него
}

const FIRST_SEASON = 1;
const LAST_SEASON = 3;
const KEY = 'NARUTO_CARDS';

const SERIES_NUMBER = {
    1: 220,
    2: 500,
    3: 293,
}

const BASE_TOOLTIP_CLASSES = [
    'half-arrow', // стрелочка у тултипа
    'simptip-position-bottom', // позиция тултипа
    'simptip-warning', // тип тултипа
    'simptip-fade', // красивый эффект затухания
    'simptip-smooth' // закругленный бордер
]

const handleError = message => {
    toastr.error(message);
}

/**
 * Метод для получения id карточки
 * @param str - строка '{сезон}{серия}'
 * @returns {number} - хеш
 */
const getHash = str => {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
    }
    return hash;
}

const getLSData = () => {
    const lsValue = localStorage.getItem(KEY);

    return lsValue ? JSON.parse(lsValue) : [];
}

const setLSData = (data) => {
    localStorage.setItem(KEY, JSON.stringify(data));
}

const handleValidateValues = (season, series) => {
    if (season < FIRST_SEASON || season > LAST_SEASON) {
        return false;
    }

    return series >= 0 && series <= SERIES_NUMBER[season];
}

const getIsUnique = (objectId) => {
    const cardWithGivenId = document.querySelector(`#card${objectId}`);

    return !cardWithGivenId;
}

const getSeriesUrl = (season, series) => {
    return `https://jut.su/naruuto/season-${season}/episode-${series}.html`
}

/**
 * Меняем поле isChecked у объекта в localStorage
 * Если этой карточки нет в localStorage, то ничего не делаем
 * @param objectId
 */
const handleSetIsChecked = (objectId) => {
    const currentData = getLSData();
    const currentObj = currentData.find(item => item.id === objectId);

    if (!currentObj) return;

    const newObj = {
        ...currentObj,
        isChecked: !currentObj.isChecked,
    };
    setLSData([...currentData.filter(item => item.id !== objectId), newObj]);
}

/**
 * Создаем кнопки
 * @param object - текущий объект
 * @returns {HTMLDivElement} - [deleteButton, checkButton]
 */
const createCardButtons = (object) => {
    const objectId = object.id;
    const isChecked = object.isChecked;

    const cardButtons = buttonsTemplate.content.cloneNode(true);

    const [deleteButton, checkButton] = cardButtons.querySelectorAll('button');
    deleteButton.addEventListener('click', () => {
        document.querySelector(`#card${objectId}`).remove(); // удаление из DOM-дерева
        const currentData = getLSData();
        const filteredData = currentData.filter(item => item.id !== objectId);
        setLSData(filteredData);
    })

    const checkImg = checkButton.querySelector('img');
    checkImg.setAttribute('src', isChecked ? 'src/assets/icons/remove.svg' : 'src/assets/icons/confirm.svg');
    checkButton.setAttribute('data-action', isChecked ? 'remove' : 'confirm');
    checkButton.addEventListener('click', (event) => {
        if (event.currentTarget.dataset.action === 'confirm') {
            document.querySelector(`#card${objectId}`).setAttribute('data-checked', true);
            checkButton.removeChild(checkImg);
            checkImg.setAttribute('src', 'src/assets/icons/remove.svg');
            checkButton.appendChild(checkImg);
            checkButton.setAttribute('data-action', 'remove');
        } else {
            document.querySelector(`#card${objectId}`).removeAttribute('data-checked');
            checkButton.removeChild(checkImg);
            checkImg.setAttribute('src', 'src/assets/icons/confirm.svg');
            checkButton.appendChild(checkImg);
            checkButton.setAttribute('data-action', 'confirm');
        }

        handleSetIsChecked(objectId);
    })

    return cardButtons;

}

/**
 * Создаем карточку объекта
 * @param object - текущий объект
 */
const renderObjectCard = (object) => {
    const card = document.createElement('div');
    card.classList.add('card');

    if (object.isChecked) card.setAttribute('data-checked', true);

    const currentData = getLSData();
    if (currentData.find(item => item.id === object.id)) {
        const hintSpan = document.createElement('span');
        const lockImg = document.createElement('img');
        lockImg.setAttribute('src', 'src/assets/icons/lock.svg');
        lockImg.setAttribute('alt', 'lock');
        hintSpan.classList.add(...BASE_TOOLTIP_CLASSES, 'card-lock');
        hintSpan.setAttribute('data-tooltip', 'Выбор сохранен в LS') // текст тултипа
        hintSpan.appendChild(lockImg);
        card.appendChild(hintSpan);
    }

    const season = document.createElement('span');
    season.innerText = `Номер сезона: ${object.season}`
    const series = document.createElement('span');
    series.innerText = `Номер серии: ${object.series}`;
    const url = document.createElement('a');
    url.innerText = 'Ссылка на просмотр';
    url.setAttribute('href', object.url);
    url.setAttribute('target', '_blank');

    const buttons = createCardButtons(object);

    card.append(season, series, url, buttons);
    card.setAttribute('id', `card${object.id}`);
    cardsContainer.appendChild(card);
}

window.addEventListener('load', () => {
    const currentData = getLSData();

    currentData.forEach(renderObjectCard);
});

const surveyForm = document.querySelector('.survey-form');
const surveyFormInputs = document.querySelectorAll('.survey-form-input');
const surveyFormCheckbox = document.querySelector('.form-flag');
const cardsContainer = document.querySelector('.cards-container');
const buttonsTemplate = document.querySelector('#buttons-template');
surveyForm.onsubmit = (event) => {
    event.preventDefault(); // чтобы убрать дефолтную перезагрузку страницы
    const [season, series] = Array.from(surveyFormInputs.values()).map(input => Number(input.value));
    const objectId = getHash(`${season}${series}`);

    const isValid = handleValidateValues(season, series);
    const isUnique = getIsUnique(objectId);

    if (!isValid) {
        handleError('Проверьте правильность введенных данных!');
        return;
    } else if (!isUnique) {
        handleError('Карточка с данными параметрами уже была добавлена!');
        return;
    }

    const newDataObject = {
        id: objectId,
        season,
        series,
        url: getSeriesUrl(season, series),
        isChecked: false,
    }

    const isSavingData = surveyFormCheckbox.checked;

    if (isSavingData) {
        const prevData = getLSData();
        setLSData([...prevData, newDataObject])
    }

    renderObjectCard(newDataObject);
}