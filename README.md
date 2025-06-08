# [Power Deal](https://daniel-cocos.github.io/power-deal/)

Web page generates random "powerups" in the form of cards, which, can be used during Blackjack games to add an extra layer of strategy and fun when playing with friends. I have coded this project for fun, **I do not endorce gambling in any way shape or form**. 

## Features

- **Random Powerups Generation:** Powerups are randomly generated each time the "Generate Powerup" button is clicked.
- **Interactive Powerup Cards:** Each powerup card is interactive, displaying an image, title, and description. Clicking a powerup will show a detailed popup.
- **Powerup Effects:** Each powerup comes with a unique ability (e.g., stealing cards, forcing a draw, etc.).
- **Rules Popup:** View the rules of the game by clicking on the "Rules" link.
- **Powerup Usage:** A player can use a powerup, causing its effect to be applied to the game, and it will be removed from the player's available powerups.

## Powerups

Feel free to customize as you wish

| Title          | Description                                                        | Chance | Type      |
|----------------|--------------------------------------------------------------------|--------|-----------|
| +10            | Add 10 to self or opponent                                         | 4      | Offensive |
| +5             | Add 5 to self or opponent                                          | 8      | Offensive |
| Chicken        | Remove 1 chip from your bet                                        | 11     | Defensive |
| Force Draw     | Force opponent to draw another card                                | 8      | Offensive |
| Invisible Hand | Your cards are hidden next round                                   | 3      | Utility   |
| Mirror         | Redirect offensive powerup back to user                            | 7      | Defensive |
| Raised Stakes  | Force everyone to raise bets by 3 including self                   | 9      | Utility   |
| Remove         | Remove latest drawn card from opponent                             | 9      | Offensive |
| Rewind         | Revert last action                                                 | 10     | Utility   |
| Shield         | Used to prevent any powerup to be used on you                      | 9      | Defensive |
| Signal Jammer  | Block opponent powerups next round                                 | 5      | Utility   |
| Steal          | Steal last drawn card from one opponent                            | 10     | Offensive |
| Sturdy Wipe    | Make one opponent lose all the powerups that they have acquired    | 3      | Utility   |
| Swap Hands     | Swap hands with opponent                                           | 4      | Utility   |


## Setup

To get started, simply clone the repository and open the `index.html` file in your browser.

### Clone the Repository

```bash
git clone https://github.com/Daniel-Cocos/power-deal.git
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
