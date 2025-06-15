const somManagerTemplate = {
    INITIAL_RADIUS: null,
    INITIAL_LEARNING_RATE: 0.1,
    GRID_SIZE: 20,
    entities: [],
    trainingData: [],
    inputDim: -1,
    nodes: [],
    currentEpoch: -1,
    totalEpochs: -1,
    init: function (gridSize, entities, trainingData)
    {
        const instance = Object.create(this);

        instance.GRID_SIZE = gridSize;
        instance.entities = entities;
        instance.trainingData = trainingData;
        instance.inputDim = trainingData[0].length;

        instance.INITIAL_RADIUS = gridSize/2;
        instance.INITIAL_LEARNING_RATE = 0.1;

        const nodes = [];
        for ( let y = 0; y < this.GRID_SIZE; y++ )
        {
            nodes[y] = [];
            for ( let x = 0; x < this.GRID_SIZE; x++ )
            {
                const weights = Array.from({length: instance.inputDim}, () => Math.random());
                nodes[y][x] = {
                    x, y, weights
                }
            }
        }
        this.nodes = nodes;
        this.currentEpoch = 0;
        this.totalEpochs = 500 + ( gridSize * gridSize ) + ( this.inputDim * 20 );

        return instance;
    },
    findBMU: function ( inputs = [] )
    {
        let minDist = Infinity;
        let bmu = null;
        for ( let y = 0; y < this.GRID_SIZE; y++ )
        {
            for ( let x = 0; x < this.GRID_SIZE; x++ )
            {
                const node = this.nodes[y][x];
                let dist = 0;
                for ( let i = 0; i < this.inputDim; i++ )
                {
                    dist += (inputs[i]-node.weights[i])**2;
                }
                if ( dist < minDist )
                {
                    minDist = dist;
                    bmu = node;
                }
            }
        }
        return bmu;
    },
    trainEpoch: function ()
    {
        const progressRatio = this.currentEpoch/this.totalEpochs;
        const radius = this.INITIAL_RADIUS * ( 1 - progressRatio );
        const lr = this.INITIAL_LEARNING_RATE * ( 1 - progressRatio );
        const inputs = this.trainingData[ Math.floor( this.trainingData.length * Math.random() ) ];
        const bmu = this.findBMU( inputs );
        for ( let y = 0; y < this.GRID_SIZE; y++ )
        {
            for ( let x = 0; x < this.GRID_SIZE; x++ )
            {
                const node = this.nodes[y][x];
                const dist = Math.sqrt( (bmu.x-node.x)**2 + (bmu.y-node.y)**2 );
                if ( dist < radius )
                {
                    const influence = Math.exp(-(dist**2) / (2*radius**2));
                    for ( let i = 0; i < this.inputDim; i++ )
                    {
                        node.weights[i] += lr * influence * (inputs[i] - node.weights[i] );
                        node.weights[i] = Math.max( 0, Math.min( node.weights[i], 1 ) );
                    }
                }
            }
        }
        this.currentEpoch++;
    },
    calculateError: function()
    {
        let error = 0;
        for (const sample of TRAINING_DATA) {
            const bmu = this.findBMU(sample);
            for (let i = 0; i < sample.length; i++) {
                error += (sample[i] - bmu.weights[i]) ** 2;
            }
        }
        error = Math.sqrt(error / (TRAINING_DATA.length * this.inputDim));
        return error;
    }
}