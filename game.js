class BlackjackGame {
    constructor() {
        this.deck = [];
        this.playerCards = [];
        this.dealerCards = [];
        this.gameOver = false;

        // Элементы DOM
        this.playerCardsEl = document.getElementById('player-cards');
        this.dealerCardsEl = document.getElementById('dealer-cards');
        this.playerScoreEl = document.getElementById('player-score');
        this.dealerScoreEl = document.getElementById('dealer-score');
        this.messageEl = document.getElementById('message');

        // Кнопки
        document.getElementById('hit-btn').addEventListener('click', () => this.hit());
        document.getElementById('stand-btn').addEventListener('click', () => this.stand());
        document.getElementById('new-game-btn').addEventListener('click', () => this.startNewGame());

        this.startNewGame();
    }

    createDeck() {
        const suits = ['♥', '♦', '♠', '♣'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];

        for (let suit of suits) {
            for (let rank of ranks) {
                deck.push({ suit, rank });
            }
        }
        return deck;
    }

    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    calculateScore(cards) {
        let score = 0;
        let aces = 0;

        for (let card of cards) {
            if (card.rank === 'A') {
                aces++;
                score += 11;
            } else if (['J', 'Q', 'K'].includes(card.rank)) {
                score += 10;
            } else {
                score += parseInt(card.rank);
            }
        }

        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }

        return score;
    }

    dealInitialCards() {
        this.playerCards = [this.deck.pop(), this.deck.pop()];
        this.dealerCards = [this.deck.pop(), this.deck.pop()];
    }

    displayCard(card, container) {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${card.suit === '♥' || card.suit === '♦' ? 'red' : ''}`;
        cardEl.textContent = `${card.rank}${card.suit}`;
        container.appendChild(cardEl);
    }

    updateScores() {
        const playerScore = this.calculateScore(this.playerCards);
        const dealerScore = this.gameOver ? this.calculateScore(this.dealerCards) : '?';

        this.playerScoreEl.textContent = `Счёт: ${playerScore}`;
        this.dealerScoreEl.textContent = `Счёт: ${dealerScore}`;
    }

    showCards() {
        // Очищаем отображение
        this.playerCardsEl.innerHTML = '';
        this.dealerCardsEl.innerHTML = '';

        // Показываем карты игрока
        this.playerCards.forEach(card => this.displayCard(card, this.playerCardsEl));

        // Показываем карты дилера
        if (this.gameOver) {
            // В конце игры показываем все карты дилера
            this.dealerCards.forEach(card => this.displayCard(card, this.dealerCardsEl));
        } else {
            // Во время игры скрываем одну карту дилера
            this.displayCard(this.dealerCards[0], this.dealerCardsEl);
            const hiddenCard = document.createElement('div');
            hiddenCard.className = 'card hidden';
            hiddenCard.textContent = '?';
            this.dealerCardsEl.appendChild(hiddenCard);
        }
    }

    hit() {
        if (this.gameOver) return;

        this.playerCards.push(this.deck.pop());
        this.showCards();
        this.updateScores();

        const playerScore = this.calculateScore(this.playerCards);
        if (playerScore > 21) {
            this.endGame('lose', 'Перебор! Вы проиграли.');
        }
    }

    stand() {
        if (this.gameOver) return;
        this.gameOver = true;

        // Ход дилера
        let dealerScore = this.calculateScore(this.dealerCards);
        while (dealerScore < 17) {
            this.dealerCards.push(this.deck.pop());
            dealerScore = this.calculateScore(this.dealerCards);
        }

        this.showCards();
        this.updateScores();
        this.determineWinner();
    }

    determineWinner() {
        const playerScore = this.calculateScore(this.playerCards);
        const dealerScore = this.calculateScore(this.dealerCards);

        if (dealerScore > 21) {
            this.endGame('win', 'Дилер перебрал! Вы выиграли!');
        } else if (playerScore > dealerScore) {
            this.endGame('win', 'Вы выиграли!');
        } else if (playerScore < dealerScore) {
            this.endGame('lose', 'Дилер выиграл!');
        } else {
            this.endGame('draw', 'Ничья!');
        }
    }

    endGame(result, message) {
        this.gameOver = true;
        this.messageEl.textContent = message;
        this.messageEl.className = `message ${result}`;
    }

    startNewGame() {
        // Сбрасываем состояние
        this.gameOver = false;
        this.deck = this.shuffleDeck(this.createDeck());
        this.dealInitialCards();

        // Обновляем интерфейс
        this.showCards();
        this.updateScores();
        this.messageEl.textContent = '';
        this.messageEl.className = 'message';
    }
}

// Запускаем игру при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new BlackjackGame();
});
