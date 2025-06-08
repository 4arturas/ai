const {message} = antd;

const txtInfoReality = "This represents the <strong>real-world input vectors</strong> used to train the Self-Organizing Map. Each animal's characteristics serve as a <strong>data point</strong> that the SOM will learn to <strong>categorize</strong> and <strong>represent</strong>.";
const txtInfoBlankSlate = "This concept, similar to John Locke's \"blank slate,\" describes the Self-Organizing Map's <strong>initial state</strong> before any training. The SOM's nodes begin with <strong>random weights</strong> and gradually learn to represent the input data through an <strong>unsupervised learning process</strong>.";

const somDrawing = {
    init: function(canvasId, gridSize) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error("Canvas element not found:", canvasId);
            return null;
        }
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const cellSize = canvasWidth / gridSize;

        const drawingObject = {
            ctx: ctx,
            canvas: canvas,
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight,
            gridSize: gridSize,
            cellSize: cellSize,

            normalizeTo3D: function(weights = []) {
                let r = 0, g = 0, b = 0;
                let rCount = 0, gCount = 0, bCount = 0;

                weights.forEach((val, idx) => {
                    const channel = idx % 3;
                    if (channel === 0) {
                        r += val;
                        rCount++;
                    } else if (channel === 1) {
                        g += val;
                        gCount++;
                    } else {
                        b += val;
                        bCount++;
                    }
                });

                r = rCount > 0 ? r / rCount : 0;
                g = gCount > 0 ? g / gCount : 0;
                b = bCount > 0 ? b / bCount : 0;

                const max = Math.max(r, g, b, 1);
                return [r / max, g / max, b / max];
            },

            convertWeightsToColor: function(weights) {
                const [r, g, b] = this.normalizeTo3D(weights);
                return [
                    Math.floor(Math.max(0, Math.min(1, r)) * 255),
                    Math.floor(Math.max(0, Math.min(1, g)) * 255),
                    Math.floor(Math.max(0, Math.min(1, b)) * 255)
                ];
            },

            drawMap: function(nodes) {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                const cellSize = this.cellSize;
                for (let y = 0; y < this.gridSize; y++) {
                    for (let x = 0; x < this.gridSize; x++) {
                        const node = nodes[y][x];
                        const [r, g, b] = this.convertWeightsToColor(node.weights);
                        this.ctx.fillStyle = `rgb(${r},${g},${b})`;
                        this.ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                        this.ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                        this.ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    }
                }
            },

            updateDisplayInfo: function(somManagerInstance, somInfoId) {
                const somInfo = document.getElementById(somInfoId);
                if (!somInfo) {
                    console.warn("SOM Info element not found:", somInfoId);
                    return;
                }
                let infoHtml = "";
                [
                    {left: "Epoch", "right": somManagerInstance.currentEpoch},
                    {left: "Total Epochs", "right": somManagerInstance.totalEpochs},
                    {left: "Radius", "right": somManagerInstance.radius.toFixed(2)},
                    {left: "Learning Rate", "right": somManagerInstance.INITIAL_LEARNING_RATE},
                    {left: "Error", "right": somManagerInstance.error.toFixed(5)},
                    {left: "Input Dim", "right": somManagerInstance.inputDim},
                    {left: "Grid Size", "right": somManagerInstance.GRID_SIZE + "x" + somManagerInstance.GRID_SIZE},
                ].forEach((element) => {
                    infoHtml += `<tr><td>${element.left}</td><td>${element.right}</td></tr>`;
                });
                somInfo.innerHTML = infoHtml;
            },

            drawInfluenceCircle: function(x, y, radius) {
                const centerX = x * this.cellSize + this.cellSize / 2;
                const centerY = y * this.cellSize + this.cellSize / 2;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

                this.ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        };
        return drawingObject;
    }
};

const somManagerTemplate = {
    GRID_SIZE: 20,
    INITIAL_RADIUS: 10,
    INITIAL_LEARNING_RATE: 0.1,

    nodes: [],
    renderer: null,

    currentEpoch: 0,
    totalEpochs: 0,
    radius: 0,
    error: 0,
    inputDim: null,
    isInitialized: false,
    trainingTimeoutId: null,

    canvasId: null,
    somInfoId: null,

    init: function(canvasId, gridSize, somInfoId) {
        this.canvasId = canvasId;
        this.GRID_SIZE = gridSize;
        this.INITIAL_RADIUS = this.GRID_SIZE / 2;
        this.somInfoId = somInfoId;

        this.nodes = [];
        this.renderer = null;
        this.currentEpoch = 0;
        this.totalEpochs = 0;
        this.radius = 0;
        this.error = 0;
        this.inputDim = null;
        this.isInitialized = false;
        this.trainingTimeoutId = null;

        this.initializeMapAndDisplay();
    },

    findBestMatchingUnit: function(input = []) {
        let minDist = Infinity;
        let bmu = null;
        for (let y = 0; y < this.GRID_SIZE; y++) {
            for (let x = 0; x < this.GRID_SIZE; x++) {
                const node = this.nodes[y][x];
                let dist = 0;
                for (let i = 0; i < input.length; i++) {
                    dist += (input[i] - node.weights[i]) ** 2;
                }
                if (dist < minDist) {
                    minDist = dist;
                    bmu = node;
                }
            }
        }
        return bmu;
    },

    runTrainingEpoch: function() {
        const progressRatio = this.currentEpoch / this.totalEpochs;
        this.radius = this.INITIAL_RADIUS * (1 - progressRatio);
        const lr = this.INITIAL_LEARNING_RATE * (1 - progressRatio);

        const inputs = TRAINING_DATA[Math.floor(Math.random() * TRAINING_DATA.length)];
        const bmu = this.findBestMatchingUnit(inputs);

        for (let y = 0; y < this.GRID_SIZE; y++) {
            for (let x = 0; x < this.GRID_SIZE; x++) {
                const node = this.nodes[y][x];
                const dist = Math.sqrt((bmu.x - node.x) ** 2 + (bmu.y - node.y) ** 2);

                if (dist < this.radius) {
                    const influence = Math.exp(-(dist ** 2) / (2 * this.radius ** 2));
                    for (let i = 0; i < inputs.length; i++) {
                        node.weights[i] += lr * influence * (inputs[i] - node.weights[i]);
                        node.weights[i] = Math.max(0, Math.min(node.weights[i], 1));
                    }
                }
            }
        }
        this.currentEpoch++;
    },

    calculateQuantizationError: function() {
        let error = 0;
        for (const sample of TRAINING_DATA) {
            const bmu = this.findBestMatchingUnit(sample);
            for (let i = 0; i < sample.length; i++) {
                error += (sample[i] - bmu.weights[i]) ** 2;
            }
        }
        error = Math.sqrt(error / (TRAINING_DATA.length * this.inputDim));
        this.error = error;
    },

    startTrainingAnimation: function() {
        if (this.currentEpoch >= this.totalEpochs) {
            message.success("SOM training complete!");
            this.trainingTimeoutId = null;
            return;
        }

        this.runTrainingEpoch();
        this.renderer.drawMap(this.nodes);
        this.calculateQuantizationError();
        this.renderer.updateDisplayInfo(this, this.somInfoId);

        ANIMALS.forEach((animal, idx) => {
            const bmu = this.findBestMatchingUnit(TRAINING_DATA[idx]);
            this.renderer.drawInfluenceCircle(bmu.x, bmu.y, this.radius * this.renderer.cellSize);
            this.renderer.drawInfluenceCircle(bmu.x, bmu.y, 2);
        });

        this.trainingTimeoutId = setTimeout(() => this.startTrainingAnimation(), 16);
    },

    pauseTraining: function() {
        if (this.trainingTimeoutId) {
            clearTimeout(this.trainingTimeoutId);
            this.trainingTimeoutId = null;
            message.info("SOM training paused.");
        }
    },

    initializeMapAndDisplay: function() {
        if (this.isInitialized) {
            return;
        }

        this.renderer = somDrawing.init(this.canvasId, this.GRID_SIZE);
        if (!this.renderer || !this.renderer.ctx) {
            console.error("Failed to initialize SomDrawingRenderer for canvas:", this.canvasId);
            return;
        }

        this.inputDim = TRAINING_DATA[0].length;

        this.nodes = [];
        for (let y = 0; y < this.GRID_SIZE; y++) {
            this.nodes[y] = [];
            for (let x = 0; x < this.GRID_SIZE; x++) {
                this.nodes[y][x] = {
                    x, y,
                    weights: Array.from({length: this.inputDim}, () => Math.random())
                };
            }
        }
        this.renderer.drawMap(this.nodes);
        this.isInitialized = true;
        this.renderer.updateDisplayInfo(this, this.somInfoId);
    },

    initiateTraining: function() {
        if (!this.isInitialized) {
            this.initializeMapAndDisplay();
        }

        this.currentEpoch = 0;
        this.totalEpochs = 500 + (this.GRID_SIZE * this.GRID_SIZE) + (this.inputDim * 20);
        this.radius = this.INITIAL_RADIUS;

        if (this.trainingTimeoutId) {
            clearTimeout(this.trainingTimeoutId);
            this.trainingTimeoutId = null;
        }

        const startNode = data.nodes.find(n => n.id === "start");
        const somComponentNode = data.nodes.find(n => n.id === "somComponent");

        if (startNode && somComponentNode && window.animateCircle) {
            const timoutInterval = 500;
            window.animateCircle(startNode, somComponentNode, timoutInterval);
            setTimeout(() => {
                this.startTrainingAnimation();
            }, timoutInterval);
        } else {
            this.startTrainingAnimation();
        }
    },

    randomPrediction: function() {
        if (!this.isInitialized || this.nodes.length === 0) {
            message.error("SOM not initialized. Please click 'Train SOM' first.");
            return;
        }
        const randomInputVector = Array.from({length: this.inputDim}, () => Math.random());
        const randomPredictionNode = data.nodes.find(n => n.id === "randomPrediction");
        const somComponentNode = data.nodes.find(n => n.id === "somComponent");

        window.animateCircle(randomPredictionNode, somComponentNode, 500);
        animatePrediction(randomInputVector, this);
    }
};

let mySomManager = null;

function predictClass(inputVector = [], manager) {
    if (!manager.isInitialized || manager.nodes.length === 0) {
        return {name: "Unclassified", features: [0.5, 0.5, 0.5]};
    }
    if (manager.currentEpoch === 0) {
        return {name: "Unclassified (Untrained)", features: [0.5, 0.5, 0.5]};
    }

    const bmuForInput = manager.findBestMatchingUnit(inputVector);
    let minDist = Infinity;
    let closestAnimal = null;

    ANIMALS.forEach((animal, idx) => {
        const trainingDataVector = TRAINING_DATA[idx];
        let dist = 0;
        for (let i = 0; i < trainingDataVector.length; i++) {
            dist += (trainingDataVector[i] - bmuForInput.weights[i]) ** 2;
        }
        dist = Math.sqrt(dist);

        if (dist < minDist) {
            minDist = dist;
            closestAnimal = animal;
        }
    });
    return closestAnimal;
}

function animatePrediction(inputVector = [], manager) {
    const timoutInterval = 500;
    const predictedAnimal = predictClass(inputVector, manager);
    const [r, g, b] = manager.renderer.convertWeightsToColor(predictedAnimal.features);

    const somComponentNode = data.nodes.find(n => n.id === "somComponent");
    const somPredictionNode = data.nodes.find(n => n.id === "somPrediction");

    window.animateCircle(
        somComponentNode,
        somPredictionNode,
        timoutInterval,
        `rgb(${r},${g},${b})`
    );

    const somPredictionTbody = document.getElementById("somPrediction");
    somPredictionTbody.innerHTML = `<tr><td style="background-color:rgb(${r},${g},${b});">&nbsp;&nbsp;&nbsp;</td><td>${predictedAnimal.name}</td></tr>`;
}

function handlePredictButtonClick(idx) {
    if (!mySomManager || !mySomManager.isInitialized) {
        message.error("SOM not initialized. Please click 'Train SOM' first.");
        return;
    }
    const inputVector = TRAINING_DATA[idx];

    const timoutInterval = 500;
    const [r, g, b] = mySomManager.renderer.convertWeightsToColor(inputVector);
    const somTrainDataNode = data.nodes.find(n => n.id === "somTrainData");
    const somComponentNode = data.nodes.find(n => n.id === "somComponent");

    window.animateCircle(
        somTrainDataNode,
        somComponentNode,
        timoutInterval,
        `rgb(${r},${g},${b})`
    );
    setTimeout(() => {
        animatePrediction(inputVector, mySomManager);
    }, timoutInterval);
}

function handleMouseOver(event, manager) {
    const canvas = document.getElementById(manager.canvasId);
    if (!canvas || !manager.isInitialized || !manager.renderer) {
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const cellSize = manager.renderer.cellSize;

    const gridX = Math.floor(mouseX / cellSize);
    const gridY = Math.floor(mouseY / cellSize);

    const hoverInfoElement = document.getElementById("hoverInfoContent");

    if (gridX >= 0 && gridX < manager.GRID_SIZE && gridY >= 0 && gridY < manager.GRID_SIZE) {
        const hoveredNode = manager.nodes[gridY][gridX];
        const closestClass = predictClass(hoveredNode.weights, manager);
        const [r, g, b] = manager.renderer.convertWeightsToColor(hoveredNode.weights);
        hoverInfoElement.innerHTML = `Hovered Cell (${gridX}, ${gridY}): ${closestClass.name} <span style="display:inline-block; width:15px; height:15px; background-color:rgb(${r},${g},${b}); border:1px solid #ccc; vertical-align:middle;"></span>`;
    } else {
        hoverInfoElement.textContent = "Hover over the map for cell info.";
    }
}

function populateTrainingDataButtons() {
    const somTrainData = document.getElementById("somTrainData");
    if (!somTrainData || !mySomManager || !mySomManager.renderer) return;

    let trainDataHtml = "";
    ANIMALS.forEach((animal, idx) => {
        const [r, g, b] = mySomManager.renderer.convertWeightsToColor(TRAINING_DATA[idx]);
        const bgColor = `rgb(${r}, ${g}, ${b})`;
        trainDataHtml += `
            <tr>
                <td style="background-color:${bgColor};">&nbsp;&nbsp;&nbsp;</td>
                <td>
                    <button style="border:1px solid ${bgColor}; padding:0 5px;" onclick="handlePredictButtonClick(${idx})">
                        ${animal.name}
                    </button>
                </td>
            </tr>`;
    });
    somTrainData.innerHTML = trainDataHtml;
}


const data = {
    nodes: [
        {
            "id": "start",
            "html": `
                <div style="background-color: #ffcc00; padding: 10px; border-radius: 5px;">
                    <button onclick="mySomManager.initiateTraining()">
                        Train SOM ▶
                    </button>
                </div>`,
            "width": 120,
            "height": 50,
            "x": 422,
            "y": 800
        },
        {
            "id": "pauseButton",
            "html": `
                <div style="background-color: #ffcc00; padding: 10px; border-radius: 5px;">
                    <button onclick="mySomManager.pauseTraining()">
                        Pause ❚❚
                    </button>
                </div>`,
            "width": 120,
            "height": 50,
            "x": 422,
            "y": 900
        },
        {
            "id": "randomPrediction",
            "html": `
                <div style="background-color: orange; padding: 10px; border-radius: 5px;">
                    <button onclick="mySomManager.randomPrediction()">
                        Random Prediction
                    </button>
                </div>`,
            "width": 120,
            "height": 50,
            "x": 422,
            "y": 610
        },
        {
            "id": "somComponent",
            html: `<canvas id="somComponent" width="500" height="500" style="width: 500px; height: 500px; border: 1px solid #ddd;"></canvas>`,
            "width": 500,
            "height": 500,
            "x": 1068,
            "y": 820
        },
        {
            "id": "somTrainData",
            html: `<table><tbody id="somTrainData"></tbody></table>`,
            "width": 180,
            "height": 400,
            "x": 463,
            "y": 284
        },
        {
            "id": "somInfo",
            html: `<table><tbody id="somInfo"></tbody></table>`,
            "width": 250,
            "height": 250,
            "x": 1655,
            "y": 300
        },
        {
            "id": "somPrediction",
            html: `
<table>
<thead><tr><th>Prediction</th></tr></thead>
<tbody id="somPrediction"></tbody>
</table>
`,
            "width": 180,
            "height": 100,
            "x": 1655,
            "y": 850
        },
        {
            "id": "hoverInfo",
            html: `<div><span id="hoverInfoContent">Hover over the map for cell info.</span></div>`,
            "width": 300,
            "height": 50,
            "x": 1700,
            "y": 1100
        },


        {id: 'reality',
            html: `
<table>
    <thead>
        <tr>
            <th>💡Reality (Training Data)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${txtInfoReality}</td>
        </tr>
    </tbody>
</table>
`,
            width: 300, height: 200, x: 790, y: 130
        },

        {id: 'tabulaRasa',
            html: `
<table>
    <thead>
        <tr>
            <th>💡Tabula Rasa (Initial SOM State)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>${txtInfoBlankSlate}</td>
        </tr>
    </tbody>
</table>
`,
            width: 300, height: 250, x: 1200, y: 130
        },
    ],
    edges: [
        {source: 'start', target: 'somComponent', label: 'Initialize SOM', type: edgeTypes.straight, markerType: 'circle'},
        {source: 'pauseButton', target: 'somComponent', label: 'Pause SOM training', type: edgeTypes.straight, markerType: 'circle'},
        {source: 'randomPrediction', target: 'somComponent', label: 'Random Prediction', type: edgeTypes.straight, markerType: 'circle'},
        {source: 'somTrainData', target: 'somComponent', label: 'Input for Training', type: edgeTypes.straight, markerType: 'arrow'},
        {source: 'somComponent', target: 'somInfo', label: 'Display SOM Info', type: edgeTypes.straight, markerType: 'arrow'},
        {source: 'somComponent', target: 'somPrediction', label: 'Show Prediction', type: edgeTypes.straight, markerType: 'circle'},
        {source: 'somComponent', target: 'hoverInfo', label: 'Hover Info', type: edgeTypes.straight, markerType: 'arrow'},

        {source: 'reality', target: 'somTrainData', label: 'Provides Training Data', type: edgeTypes.straight, markerType: 'arrow'},
        {source: 'tabulaRasa', target: 'somComponent', label: 'Initializes Map', type: edgeTypes.straight, markerType: 'arrow'},
        {source: 'start', target: 'pauseButton', label: 'Control Training', type: edgeTypes.straight, markerType: 'arrow'},
    ],
    render: function(gNode, d) {
        const renderNode = (id, innerHtml) => {
            const foreignObject = gNode.append('foreignObject')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', d.width)
                .attr('height', d.height);

            const div = foreignObject.append('xhtml:div')
                .style('width', `${d.width}px`)
                .style('height', `${d.height}px`)
                .style('display', 'flex')
                .style('align-items', 'center')
                .style('justify-content', 'center')
                .style('padding', '5px')
                .style('box-sizing', 'border-box')
                .html(innerHtml);

            if (id === 'somComponent') {
                setTimeout(() => {
                    if (!mySomManager) {
                        mySomManager = Object.assign({}, somManagerTemplate);
                        mySomManager.init("somComponent", 20, "somInfo");
                    }
                    const canvas = document.getElementById("somComponent");
                    if (canvas && mySomManager) {
                        canvas.addEventListener('mousemove', (event) => handleMouseOver(event, mySomManager));
                        canvas.addEventListener('mouseleave', () => {
                            const hoverInfoElement = document.getElementById("hoverInfoContent");
                            if (hoverInfoElement) {
                                hoverInfoElement.textContent = "Hover over the map for cell info.";
                            }
                        });
                    }
                    populateTrainingDataButtons();
                }, 0);
            } else if (id === 'somTrainData') {

            }
        };

        if (d.text) {
            gNode.append('text')
                .text(d.text)
                .attr('x', d.width / 2)
                .attr('y', d.height / 2)
                .attr('class', 'node-text');
        } else if (d.html) {
            renderNode(d.id, d.html);
        }
        gNode.append('text')
            .attr('class', 'node-coordinates')
            .attr('x', d.width / 2)
            .attr('y', d.height + 5)
            .text(d => `(${d.x ? d.x.toFixed(0) : 'N/A'}, ${d.y ? d.y.toFixed(0) : 'N/A'})`);
    }
};
