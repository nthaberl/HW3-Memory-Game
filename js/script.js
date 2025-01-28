// DOM Elements
const gameBoard = document.querySelector('.game-cards');
const movesCounter = document.querySelector('.move-counter');
const timerDisplay = document.querySelector('.timer');
const messageDisplay = document.querySelector('.message');

//Audio Elements
let victoryMusic = new Audio('sounds/victory.mp3');
let cardFlip = new Audio('sounds/card-flip.mp3');
let matched = new Audio('sounds/match.mp3');

// Game Variables
let cards = [];
let firstCard = null;
let secondCard = null;
const totalPairs = 8;
let moves = 0;
let matchedPairs = 0;
let timerInterval; // To store the timer interval
let elapsedTime = 0; // Time in seconds
let hasStarted = false; // flag for if the game has started
let lockBoard = false //flag to prevent clicking on cards before setTimeout() completes

// Card image sources (pairs)
const images = [
    'images/black.jpg', 'images/blue.jpg', 'images/red.jpg', 'images/green.jpg',
    'images/lt-blue.jpg', 'images/melon.jpg', 'images/pink.jpg', 'images/yellow.jpg',
    'images/black.jpg', 'images/blue.jpg', 'images/red.jpg', 'images/green.jpg',
    'images/lt-blue.jpg', 'images/melon.jpg', 'images/pink.jpg', 'images/yellow.jpg'
];

// shuffling the images stored in the array
// implementing the Fisher-Yates shuffle
const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Creating a card element and adding it to the DOM
function createCardElement(image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = image;

    const cardFront = document.createElement('img');
    cardFront.src = image; // The image to show when flipped
    cardFront.classList.add('card-front');
    cardFront.style.display = 'none'; // Initially hidden

    const cardBack = document.createElement('img');
    cardBack.src = 'images/egg.jpg'; // image source for back of the card
    cardBack.classList.add('card-back');

    card.appendChild(cardFront);
    card.appendChild(cardBack);

    // Event Listener: Card click
    card.addEventListener('click', handleCardClick);
    return card;
}

// Initialize the game
function initializeGame() {
    cards = shuffle(images).map((image) => createCardElement(image));
    gameBoard.innerHTML = '';
    cards.forEach((card) => gameBoard.appendChild(card));
    //resetting the state for a new game
    moves = 0;
    matchedPairs = 0;
    elapsedTime = 0; 
    hasStarted = false;
    updateMoves();
    messageDisplay.textContent = '';
    updateTimer();

    // Start the timer
    clearInterval(timerInterval); // Clear any previous timer
}


// Handle card click
function handleCardClick(event) {
    const clickedCard = event.currentTarget;
    cardFlip.play();

    if (!hasStarted) {
        hasStarted = true;
        timerInterval = setInterval(() => {
            elapsedTime++;
            updateTimer();
        }, 1000);
    }
    
    if (lockBoard || clickedCard === firstCard || clickedCard.classList.contains('matched')) {
        cardFlip.pause(); //prevents cardFlip sound from playing on already clicked cards
        return; // Prevents double-clicks or clicking matched cards
    }

    // Flip the card
    const cardFront = clickedCard.querySelector('.card-front');
    const cardBack = clickedCard.querySelector('.card-back');
    cardFront.style.display = 'block';
    cardBack.style.display = 'none';

    if (!firstCard) {
        firstCard = clickedCard;
    } else if (!secondCard) {
        secondCard = clickedCard;
        lockBoard = true; //prevents extra card clicks
        checkForMatch();
    }
}

// Check for a match
function checkForMatch() {
    moves++;
    updateMoves();

    if (firstCard.dataset.image === secondCard.dataset.image) {
        matched.play();
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs++;
        resetSelections();

        // win condition
        if (matchedPairs === totalPairs) {
            clearInterval(timerInterval);
            matched.pause();
            victoryMusic.play();

            // .message div only fills with this info after winning the game
            messageDisplay.innerHTML = `<h3>Congrats, you won in ${moves} moves!</h3>`;
            const newGameButton = document.createElement('button');
            newGameButton.textContent = 'Play Again';
            newGameButton.classList.add('new-game-button');
            newGameButton.addEventListener('click', initializeGame);
            messageDisplay.appendChild(newGameButton);
        }
    } else {
        setTimeout(() => {
            const firstFront = firstCard.querySelector('.card-front');
            const firstBack = firstCard.querySelector('.card-back');
            firstFront.style.display = 'none';
            firstBack.style.display = 'block';

            const secondFront = secondCard.querySelector('.card-front');
            const secondBack = secondCard.querySelector('.card-back');
            secondFront.style.display = 'none';
            secondBack.style.display = 'block';

            resetSelections();
        }, 1000); // Flip cards back after delay
    }
}

// Reset card selections after two cards have been clicked on
function resetSelections() {
    lockBoard = false; //allows for card clicks again
    firstCard = null;
    secondCard = null;
}

// keep track of moves
function updateMoves() {
    movesCounter.innerHTML = `<h3>Moves: ${moves}</h3>`;
}

// Update timer display
function updateTimer() {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerDisplay.innerHTML = `<h3>Time: ${minutes}:${seconds.toString().padStart(2, '0')}</h3>`
}

// Start the game
document.addEventListener("DOMContentLoaded", () => {
    initializeGame();
});
