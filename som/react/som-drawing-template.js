function reduceTo3D( weights = [] )
{
    let r = 0, g = 0, b = 0;
    weights.forEach( (v,idx) => {
        const channel = idx % 3;
        const weight = 1 / ( Math.floor(idx/3) + 1 );
        if ( channel === 0 )
            r += v * weight;
        else if ( channel === 1 )
            g += v * weight;
        else
            b += v * weight;
    })
    const max = Math.max( r, g, b, 1 );
    return [r/max,g/max,b/max];
}
function weightsToColors( weights = [] )
{
    const [r,g,b] = reduceTo3D( weights );
    return [
        Math.floor( Math.max( 0, Math.min( r, 1 ) ) * 255 ),
        Math.floor( Math.max( 0, Math.min( g, 1 ) ) * 255 ),
        Math.floor( Math.max( 0, Math.min( b, 1 ) ) * 255 )
    ];
}
const somDrawingTemplate = {
    canvas: null,
    gridSize: null,
    cellSize: null,
    init: function(canvas, gridSize) {
        this.canvas = canvas;
        this.gridSize = gridSize;
        this.cellSize = canvas.width/gridSize;
        return this;
    },

    drawWeights: function ( nodes )
    {
        const ctx = this.canvas.getContext("2d");
        for ( let y = 0; y < this.gridSize; y++ )
        {
            for ( let x = 0; x < this.gridSize; x++ )
            {
                const node = nodes[y][x];
                const [r,g,b] = weightsToColors( node.weights );
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(this.cellSize*x,this.cellSize*y,this.cellSize,this.cellSize);
            }
        }
    },

    drawUMatrix: function(nodes) {
        const ctx = this.canvas.getContext("2d");
        const uMatrixValues = [];
        let maxDist = 0;

        const getEuclideanDistance = (weights1, weights2) => {
            let sumSq = 0;
            for (let i = 0; i < weights1.length; i++) {
                sumSq += (weights1[i] - weights2[i]) ** 2;
            }
            return Math.sqrt(sumSq);
        };

        for (let y = 0; y < this.gridSize; y++) {
            uMatrixValues[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                const currentNode = nodes[y][x];
                let totalNeighborDist = 0;
                let neighborCount = 0;

                // Check neighbors (up, down, left, right)
                if (y > 0) { // Up
                    totalNeighborDist += getEuclideanDistance(currentNode.weights, nodes[y-1][x].weights);
                    neighborCount++;
                }
                if (y < this.gridSize - 1) { // Down
                    totalNeighborDist += getEuclideanDistance(currentNode.weights, nodes[y+1][x].weights);
                    neighborCount++;
                }
                if (x > 0) { // Left
                    totalNeighborDist += getEuclideanDistance(currentNode.weights, nodes[y][x-1].weights);
                    neighborCount++;
                }
                if (x < this.gridSize - 1) { // Right
                    totalNeighborDist += getEuclideanDistance(currentNode.weights, nodes[y][x+1].weights);
                    neighborCount++;
                }

                const avgDist = neighborCount > 0 ? totalNeighborDist / neighborCount : 0;
                uMatrixValues[y][x] = avgDist;
                if (avgDist > maxDist) {
                    maxDist = avgDist;
                }
            }
        }

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const normalizedDist = maxDist > 0 ? uMatrixValues[y][x] / maxDist : 0;
                const grayValue = Math.floor(normalizedDist * 255); // Darker for higher distance
                ctx.fillStyle = `rgb(${grayValue},${grayValue},${grayValue})`;
                ctx.fillRect(this.cellSize*x, this.cellSize*y, this.cellSize, this.cellSize);
            }
        }
    }
};