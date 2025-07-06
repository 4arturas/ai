// Hyperparameters
const learningRate = 0.1;
const discountFactor = 0.9;
let epsilon = 1.0;
const epsilonDecay = 0.999;
const minEpsilon = 0.1;
const trainingEpisodes = 10000;

const gridSize = 4;
const tileSize = canvas.width / gridSize;
const states = gridSize * gridSize;
const actions = 4; // 0: up, 1: right, 2: down, 3: left

const lake = [
    'S', 'F', 'F', 'F',
    'F', 'H', 'F', 'H',
    'F', 'F', 'F', 'H',
    'H', 'F', 'F', 'G'
];

let qTable = Array(states).fill(0).map(() => Array(actions).fill(0));
let agentPos = { x: 0, y: 0 };

function resetAgent()
{
    agentPos = { x: 0, y: 0 };
}
function getState()
{
    return agentPos.y * gridSize + agentPos.x;
}
function chooseAction( state )
{
    if ( Math.random() < epsilon )
        return Math.floor( Math.random() * actions );
    const maxQ = Math.max( ...qTable[state] );
    const bestActions = [];
    for ( let i = 0; i < actions; i++ )
    {
        if ( maxQ === qTable[state][i] )
            bestActions.push( i );
    }
    return bestActions[Math.floor( Math.random()*bestActions.length)];
}
function takeActions( action )
{
    let { x, y } = agentPos;
    if ( action === 0 ) y--;
    if ( action === 1 ) x++;
    if ( action === 2 ) y++;
    if ( action === 3 ) x--;
    if ( x < 0 || x >= gridSize || y < 0 || y >= gridSize )
        return { reward: -1, done: true };
    const title = lake[getState()];
    if ( title === "H" )
        return { reward: -1, done: true };
    if ( title === "G" )
        return { reward: +1, done: true };
    return { reward: 0, done: false };
}
function train()
{
    for ( let i = 0; i < trainingEpisodes; i++ )
    {
        resetAgent();
        let done = false;
        let state = getState();
        let action = chooseAction( state );
        while ( !done )
        {
            const { reward, done: newDone } = takeActions( action );
            const newState = getState();
            const newAction = chooseAction( newState );

            const oldQ = qTable[state][action];
            const nextQValue = newDone ? 0 : qTable[newState][newAction];
            const newQ = oldQ + learningRate * ( reward + discountFactor * nextQValue - oldQ );
            qTable[state][action] = newQ;

            state = newState;
            action = newAction;
            done = newDone;
        }
        epsilon = Math.max( minEpsilon, epsilon*epsilonDecay );
    }
}