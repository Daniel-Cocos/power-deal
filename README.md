# Power Deal

Web page generates random "powerups" in the form of cards, which, can be used during Blackjack games to add an extra layer of strategy and fun when playing with friends. I have coded this project for fun, **I do not endorce gambling in any way shape or form**. 

## Features

- **Random Powerups Generation:** Powerups are randomly generated each time the "Generate Powerup" button is clicked.
- **Interactive Powerup Cards:** Each powerup card is interactive, displaying an image, title, and description. Clicking a powerup will show a detailed popup.
- **Powerup Effects:** Each powerup comes with a unique ability (e.g., stealing cards, forcing a draw, etc.).
- **Rules Popup:** View the rules of the game by clicking on the "Rules" link.
- **Powerup Usage:** A player can use a powerup, causing its effect to be applied to the game, and it will be removed from the player's available powerups.

## Powerups

Feel free to customize as you wish

- **Sturdy Wipe:** Ignores all active powerups.
- **Shield:** Prevents any powerup from being used on the player.
- **Mirror:** Redirects offensive powerups back to the opponent.
- **+5:** Forces the player or their opponent to add 5 to their total by the end of the round.
- **+10:** Forces the player or their opponent to add 10 to their total by the end of the round.
- **Remove:** Makes either the player or their opponent discard their latest drawn card.
- **Force Draw:** Forces an opponent to draw another card.
- **Swap Hands:** Allows the player to choose an opponent and swap hands with them.
- **Rewind:** Reverts the last action, such as card draws or powerup uses.
- **Steal:** Allows the player to steal a card from an opponent’s hand.
- **Signal Jammer:** Prevents 1 opponent from using any powerup for the duration of the next round.
- **Invisible Hand:** For the duration of the next round, all your cards will be hidden from every opponent.


## Setup

To get started, simply clone the repository and open the `index.html` file in your browser.

### Clone the Repository

```bash
git clone https://github.com/your-username/blackjack-powerups.git
```

### File Structure

```
power-deal
├── css
│   └── global.css
├── inc
│   └── powerups.js
├── index.html
└── README.md
```

## How to Use

1. **Generate Powerups:** Click the "Generate Powerup" button to create a random powerup.
2. **View Powerup Details:** Click on any generated powerup to open a detailed popup displaying its image and description.
3. **Use Powerup:** Once in the popup, click the "Use Powerup" button to apply the powerup and close the popup.
4. **Close Popup:** You can also close the popup by clicking the "Close" button.

## Dependencies

- None. I am using vanilla JavaScript, HTML, and CSS.
