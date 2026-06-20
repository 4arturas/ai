const { Button } = antd;

const ANIMALS = [
    { name: "Eagle",    features: [0.8, 2, 1, 1, 0.7, 0, 0.9, 0.6, 0.8] },
    { name: "Lion",     features: [0.9, 4, 0, 1, 1,   0, 0.8, 0.9, 0.7] },
    { name: "Dolphin",  features: [0.9, 0, 0, 1, 0,   1, 0.9, 0.3, 0.9] },
    { name: "Spider",   features: [0.1, 8, 0, 0, 0,   0, 0.3, 0.1, 0.2] },
    { name: "Chicken",  features: [0.4, 2, 1, 1, 0.8, 0, 0.4, 0.2, 0.3] },
    { name: "Octopus",  features: [0.6, 8, 0, 0, 0,   1, 0.5, 0.4, 0.8] },
    { name: "Elephant", features: [1,   4, 0, 1, 0.3, 0, 0.6, 0.5, 0.8] },
    { name: "Butterfly",features: [0.2, 6, 1, 0, 0,   0, 0.3, 0,   0.1] },
    { name: "Shark",    features: [0.9, 0, 0, 1, 0,   1, 0.9, 0.8, 0.5] },
    { name: "Giraffe",  features: [0.9, 4, 0, 1, 0.5, 0, 0.6, 0.3, 0.6] },
    { name: "Ant",      features: [0.1, 6, 0, 0, 0,   0, 0.2, 0.1, 0.2] },
    { name: "Penguin",  features: [0.5, 2, 1, 1, 0.7, 0.5, 0.5, 0.2, 0.6] }
];
// Normalized training data
const TRAINING_DATA = ANIMALS.map(animal => {
    const maxLegs = 8, maxWings = 1, maxTail = 1;
    return [
        animal.features[0],                     // size (0-1)
        animal.features[1] / maxLegs,           // legs
        animal.features[2] / maxWings,          // wings
        animal.features[3] / maxTail,           // tail
        animal.features[4],                     // fur (0-1)
        animal.features[5],                     // aquatic (0-1)
        animal.features[6],                     // speed (0-1)
        animal.features[7],                     // aggression (0-1)
        animal.features[8]                      // intelligence (0-1)
    ];
});

const FEATURE_NAMES = ["Size", "Legs", "Wings", "Tail", "Fur", "Aquatic", "Speed", "Aggression", "Intelligence"];

const GRID_SIZE = 20;
const inputDim = TRAINING_DATA[0].length;

function SOM()
{
    const { appContext, setAppContext } = React.useContext(AppContext);
    const ref = React.useRef(null);
    const canvas = React.useRef(null);
    const ctx = React.useRef(null);

    const [nodes, setNodes] = React.useState();
    const [currentEpoch, setCurrentEpoch] = React.useState(0);

    React.useEffect( () => {
        // ref.current.innerHTML = "Hello";
        ctx.current = canvas.current.getContext("2d");
        ctx.current.fillStyle = `rgb(255,255,0,1)`;
        ctx.current.fillRect( 0, 0, canvas.current.width, canvas.current.height );

        const tmpNodes = [];
        for ( let y = 0; y < GRID_SIZE; y++ )
        {
            tmpNodes[y] = [];
            for ( let x = 0; x < GRID_SIZE; x++ )
            {
                tmpNodes[y][x] = {
                    x, y,
                    weights: Array.from( {length:inputDim}, () => Math.random() )
                }
            } // end for x
        }
        setCurrentEpoch( 0 );
    }, []);

    return (
        <div ref={ref}>
            <canvas ref={canvas} width="500" height="500"></canvas>
        </div>
    );
}