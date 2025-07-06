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

## SARSA Use Cases

Here are some examples of problems that can be solved using the SARSA algorithm:

1.  **Robotic Navigation:** Training a robot to navigate a maze or an obstacle course to reach a target destination.
2.  **Elevator Scheduling:** Optimizing elevator movements in a building to minimize passenger wait times.
3.  **Inventory Management:** Determining the optimal level of inventory to keep in stock to maximize profit and minimize waste.
4.  **Simple Game AI:** Teaching an AI to play simple games like Tic-Tac-Toe or a simplified version of Pac-Man.
5.  **Grid-World Problems:** A classic reinforcement learning problem where an agent learns to navigate a grid from a starting point to a goal while avoiding obstacles.
6.  **Resource Management in a Network:** Allocating bandwidth or other network resources to different users or applications to optimize performance.
7.  **Automated Guided Vehicle (AGV) Routing:** Directing AGVs in a warehouse to pick up and drop off items efficiently.