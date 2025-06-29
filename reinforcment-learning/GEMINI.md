# Reinforcement Learning Educational Project

This project aims to teach reinforcement learning concepts through simple, interactive web-based examples.

## Project Files

- **`rl.html`**: A basic, deterministic implementation of the "Frozen Lake" problem using Q-learning. The agent learns to navigate a grid to a goal while avoiding holes.
- **`rl-slippery.html`**: A more advanced version of "Frozen Lake" that introduces stochasticity. The agent has a chance to "slip" and move in a random direction, demonstrating how Q-learning handles uncertainty.

## Key Concepts

- **Q-learning:** The core algorithm used for learning.
- **Stochastic vs. Deterministic Environments:** The difference between the predictable world of `rl.html` and the uncertain, "slippery" world of `rl-slippery.html`.
- **Hyperparameters:**
    - `learningRate`: 0.1
    - `discountFactor`: 0.9
    - `epsilon` (for exploration): Starts at 1.0 and decays.

## Future Plans

- Explore a different algorithm like SARSA.