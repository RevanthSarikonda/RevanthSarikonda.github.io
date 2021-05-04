
// Creating Cards
const suits = ['H', 'D', 'S', 'C'];
const numbers = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck;

function cardCreation(numbers, suits) {
    let weight;

    if (/[0-9]/.test(numbers)) {
        weight = Number(numbers);
    } else if (numbers === 'A') {
        weight = 11;
    } else {
        weight = 10;
    }

    return {numbers, suits, weight};
}

function deckCreation() {
    deck = [];
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < suits.length; j++) {
            deck.push(cardCreation(numbers[i], suits[j]));
        }
    }
}

// Deck Shuffling

function shuffleDeck() {
    for (i = 0; i < 1000; i++) {
        const card1 = Math.floor(Math.random() * 52);
        const card2 = Math.floor(Math.random() * 52);

        const tempCard = deck[card1];
        deck[card1] = deck[card2];
        deck[card2] = tempCard;
    }
}

// function for drawing a card function
// Weight of the card drawn is recorded
// finding ace card

let addingScore;
let isAce;

function drawCard() {
    const newCard = deck.pop();
    const cardName = newCard.numbers + newCard.suits + '.png';
    addingScore = newCard.weight;

    if (newCard.weight === 11){
        isAce = true;
    } else {
        isAce = false;
    }

    $('.remaining').text(deck.length);

    const newCardDiv = $('<div>');
    newCardDiv.addClass('card')
              .css('background-image', 'url(cards/' + cardName + ')')

    return newCardDiv;
}

// dealing cards to player and dealer
// updating scores
// handles the special case of aces

let playerScore;
let dealerScore;

let playerAces;
let dealerAces;

function dealToPlayer() {
    $('.player .card-table').append(drawCard());

    if (isAce) playerAces++;

    playerScore += addingScore;

    if (playerScore > 21 && playerAces) {
        playerScore -= 10;
        playerAces--;
    }

    $('.player .score').text(playerScore);

    if (playerScore > 21) {
        playerStand();
    }
}

function dealToDealer() {
    $('.dealer .card-table').append(drawCard());

    if (isAce) dealerAces++;

    dealerScore += addingScore;

    if (dealerScore > 21 && dealerAces) {
        dealerScore -= 10;
        dealerAces--;
    }

    $('.dealer .score').text(dealerScore);
}

// dealing cards function to start the game

function dealCards() {
    dealToPlayer();
    dealToDealer();
    dealToPlayer();
    dealToDealer();
}

// starting the game, using Start/Restart button

$('#restart').on('click', startGame);

function startGame() {
    $('#restart').text('DEAL');
    $('.card-table').empty();
    $('#stand').prop('disabled', false);
    $('#hit').prop('disabled', false);
    $('.winner').prop('hidden', true);
    $('.player').removeClass('shadow');
    $('.dealer').removeClass('shadow');

    playerAces = 0;
    dealerAces = 0;
    playerScore = 0;
    dealerScore = 0;

    deckCreation();
    shuffleDeck();
    dealCards();

    $('.dealer .card-table div:nth-of-type(1)').addClass('blocked');
    $('.dealer .score').text('?');
}

// Hit button functionality

$('#hit').on('click', dealToPlayer);

// Stand button functionality

$('#stand').on('click', playerStand);

function playerStand() {
    $('#stand').prop('disabled', true);
    $('#hit').prop('disabled', true);

    $('.dealer .score').text(dealerScore);
    $('.dealer .card-table div:nth-of-type(1)').removeClass('blocked');
    playDealer();
}

// dealer drawing cards until it gets to 17 (*dealer hits at soft 17)

function playDealer() {
    while (dealerScore <= 17) {
        if (dealerScore === 17 && !dealerAces) {
            break;
        }
        dealToDealer();
    }

    checkWinner();
}

// checking and announcing the winner

function checkWinner() {
    $('.winner').prop('hidden', false);

    if (playerScore > 21) {
        if (dealerScore > 21) {
            $('.winner').text('You Both Busted!');
        } else {
            $('.winner').text('You Lost!');
            $('.dealer').addClass('shadow');
        }
    } else if (dealerScore > 21) {
        $('.winner').text('You Won!');
        $('.player').addClass('shadow');
    } else if (playerScore > dealerScore) {
        $('.winner').text('You Won!');
        $('.player').addClass('shadow');
    } else if (dealerScore > playerScore) {
        $('.winner').text('You Lost!');
        $('.dealer').addClass('shadow');
    } else {
        $('.winner').text('Push (Draw)');
    }

}
