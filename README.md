# [Power Deal](https://daniel-cocos.github.io/power-deal/)

Web page generates random "powerups" in the form of cards, which, can be used during Blackjack games to add an extra layer of strategy and fun when playing with friends. I have coded this project for fun, **I do not endorce gambling in any way shape or form**. 

## Features

- **Online Multiplayer Rooms:** Enter your name, then create a room (2-8 players, 4 by default) or join one with a 5 character code or invite link. Works across different networks and countries, no account needed.
- **Shared Table:** Everyone sees who is in the room, how many powerups each player holds and an activity log. When a player uses a powerup, everyone else gets a notification.
- **Turns, Actions & Bonus Actions:** The room tracks whose turn it is. Like in Baldur's Gate 3, at the start of your turn you get 1 Action and 1 Bonus action: big powerups cost your Action, smaller ones your Bonus action. Points you don't spend can still be used for defensive powerups on other players' turns, and reset to 1 of each when your next turn starts. The host can skip the turn of a player who went AFK.
- **Casino Table Look:** Felt table, gold trim and animated cards: new powerups get dealt in from the deck, played ones fly off the table, and a banner announces your turn.
- **Random Powerups Generation:** Powerups are randomly drawn each time the "Draw powerup" deck button is clicked.
- **Powerup Effects:** Each powerup comes with a unique ability (e.g., stealing cards, forcing a draw, etc.).
- **Rules Popup:** View the rules of the game by clicking on the "Rules" link.

## Powerups

Feel free to customize as you wish

| Title          | Description                                                        | Chance | Type      | Cost   |
|----------------|--------------------------------------------------------------------|--------|-----------|--------|
| +10            | Add 10 to self or opponent                                         | 4      | Offensive | Action |
| +5             | Add 5 to self or opponent                                          | 8      | Offensive | Bonus  |
| Chicken        | Remove 1 chip from your bet                                        | 11     | Defensive | Bonus  |
| Force Draw     | Force opponent to draw another card                                | 8      | Offensive | Action |
| Invisible Hand | Your cards are hidden next round                                   | 3      | Utility   | Action |
| Mirror         | Redirect offensive powerup back to user                            | 7      | Defensive | Bonus  |
| Raised Stakes  | Force everyone to raise bets by 3 including self                   | 9      | Utility   | Action |
| Remove         | Remove latest drawn card from opponent                             | 9      | Offensive | Action |
| Rewind         | Revert last action                                                 | 10     | Utility   | Bonus  |
| Shield         | Used to prevent any powerup to be used on you                      | 9      | Defensive | Bonus  |
| Signal Jammer  | Block opponent powerups next round                                 | 5      | Utility   | Action |
| Steal          | Steal last drawn card from one opponent                            | 10     | Offensive | Action |
| Sturdy Wipe    | Make one opponent lose all the powerups that they have acquired    | 3      | Utility   | Action |
| Swap Hands     | Swap hands with opponent                                           | 4      | Utility   | Action |
| Speed          | Gain an extra Action this turn                                     | 7      | Utility   | Bonus  |
| Slow           | Chosen opponent starts their next turn without a Bonus action      | 6      | Offensive | Action |
| Wild Card      | Draw 2 random powerups                                             | 5      | Utility   | Action |
| Peek           | Secretly look at the top card of the deck                          | 9      | Utility   | Bonus  |
| Double Down    | Double your bet, then draw exactly one more card                   | 6      | Utility   | Action |


## Setup

To get started, simply clone the repository and open the `index.html` file in your browser or [click here](https://daniel-cocos.github.io/power-deal/).

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

1. **Enter your name**, then either:
   - **Create game:** pick the max number of players and share the room code (or the invite link) with your friends.
   - **Join game:** type in the code you were given, or just open the invite link.
2. **Draw Powerups:** Click the "Draw powerup" deck button to draw a random powerup.
3. **View Powerup Details:** Click on any generated powerup to open a detailed popup displaying its image and description.
4. **Use Powerup:** Once in the popup, click the "Use Powerup" button to apply the powerup. It spends your Action or Bonus action, and everyone in the room is notified. Offensive and utility powerups can only be used on your turn, defensive ones at any time.
5. **End Turn:** Click "End turn" when you are done, and the next player gets their Action and Bonus action.
6. **Close Popup:** You can also close the popup by clicking the "Close" button.
