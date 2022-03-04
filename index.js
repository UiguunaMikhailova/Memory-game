const cards = document.querySelectorAll('.card-wrapper')
const startBtn = document.querySelector('.start')
const cardsContainer = document.querySelector('.cards-wrapper')
const historyBtn = document.querySelector('.history')
const historyCard = document.querySelector('.history-card')
const overlay = document.querySelector('.overlay')
const close = document.querySelector('.close')
const finish = document.querySelector('.finish')
const restart = document.querySelector('.restart')
const stepsText = document.querySelector('.finish-text')
const textGamingStory = document.querySelector('.text-gaming-story')

let hasFlippedCard = false
let lock = false
let firstCard, secondCard
let gamesStory = []
let steps = 0
let pairs = 0

window.addEventListener('load', getLocalStorage)

function getLocalStorage() { // функция получения данных с локал сторидж
    if (localStorage.getItem('text')) {
        gamesStory = JSON.parse(localStorage.getItem('text'))
        showLocalStorage(gamesStory) // и в модальное окно они вписываются
    }
}

startBtn.addEventListener('click', () => { // При нажатии на кнопку старт появляется игровое поле
    startBtn.style.display = 'none'
    cardsContainer.style.visibility = 'visible'
})

historyBtn.addEventListener('click', () => { // При нажатии на кнопку гейм хистори отображается результаты последних 10 игр
    historyCard.style.display = 'block';
    overlay.style.display = 'block';
})

close.addEventListener('click', () => { // Кнопка крести закрывает модальное окно (гейм хистори)
    historyCard.style.display = 'none';
    overlay.style.display = 'none';
})

function mixCards() { // Функция рандомного расположения карт
    cards.forEach((card) => {
        card.style.order = Math.floor(Math.random() * 16);
    });
};

mixCards();

cards.forEach(card => card.addEventListener('click', () => { // При клике на карточку происходит переворот карточки
    if (!lock) {
        if (!card.classList.contains('flip')) {
            card.classList.add('flip');

            if (!hasFlippedCard) {

                hasFlippedCard = true;
                firstCard = card;
                return;
            }

            secondCard = card;
            hasFlippedCard = false;
            match();
        }
    }
}));

function match() { // Если карты не одинаковые, то они закрываются, иначе остаются открытыми
    if (firstCard.dataset.card !== secondCard.dataset.card) {
        steps += 1;
        unflip();
        console.log(steps)
    } else {
        steps += 1;
        console.log(steps)
        pairs += 1
        console.log(pairs)
        if (pairs === 8) {
            finishGame()
        }
    }
}

function unflip() { // Закрытие карточки, с задержкой в 1 секунду
    lock = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        lock = false;
    }, 1000);
};

function finishGame() { // При финише показываем текст поздравление
    setTimeout(() => {
        finish.style.display = 'block';
        stepsText.textContent = `You won in ${steps} steps`
        setLocalStorage(stepsText.textContent)
    }, 1000)
}

function setLocalStorage(textWin) { // Функция пополнения массива с историей игр, отправляем в локал сторадж наш массив в виде строки
    if (gamesStory.length < 10) {
        gamesStory.unshift(textWin)
    } else {
        gamesStory.pop()
        gamesStory.unshift(textWin)
    }
    localStorage.setItem('text', JSON.stringify(gamesStory))
    showLocalStorage(gamesStory)
}

restart.addEventListener('click', () => { // При нажатии на кнопку новая игра закрываем все карты, миксуем
    cards.forEach(card => {
        card.classList.remove('flip')
    });
    steps = 0
    pairs = 0
    hasFlippedCard = false;
    lock = false;
    finish.style.display = 'none';
    mixCards()
})

function showLocalStorage(arr) { // Создаём строчку в гейм-хистори
    const text2 = document.querySelectorAll('.text')
    text2.forEach((elem) => elem.remove())

    if (arr.length > 0) {
        arr.forEach((elem) => {
            const text = document.createElement('p')
            text.classList.add('text')
            text.textContent = `${elem}`
            textGamingStory.appendChild(text)
        })
    }
}