const SOM_HEIGHT    = 64;
const SOM_WIDTH     = 64;
const SOM_DEPTH     = 3;

function _assert( f, msg )
{
    if ( !f )
        console.log( 'Assert error', msg );
}
const rnd_Real = ( x, y ) => Math.random() * ( y - x ) + x;
const rnd_Int = ( x, y ) => Math.random() * ( y - x + 1 ) + x;
function som_Create()
{
    const som = new Array(SOM_HEIGHT);
    for ( let y = 0; y < SOM_HEIGHT; y++ )
    {
        som[y] = new Array(SOM_WIDTH);
        for ( let x = 0; x < SOM_WIDTH; x++ )
        {
            const zArr = new Array( SOM_DEPTH );
            zArr[0] = rnd_Real( 0, 1 );
            zArr[1] = rnd_Real( 0, 1 );
            zArr[2] = rnd_Real( 0, 1 );
            som[y][x] = { y: y, x: x, z: zArr };
        } // end for x
    } // end for y
    return som;
}

function som_Dist( v0, v1 )
{
    _assert( v0.length === SOM_DEPTH, 'wrong v0 length');
    _assert( v1.length === SOM_DEPTH, 'wrong v1 length');
    let d = 0;
    for ( let z = 0; z < SOM_DEPTH; z++ )
    {
        d += Math.abs(v0[z] - v1[z] );
    }
    return Math.sqrt( d );
}
function som_BMU( som, trainVector )
{
    let somBest = null;
    let bestDistSoFar = Infinity;
    for ( let y = 0; y < SOM_HEIGHT; y++ )
    {
        for ( let x = 0; x < SOM_WIDTH; x++ )
        {
            const node = som[y][x];
            const dist = som_Dist( node.z, trainVector );
            if ( bestDistSoFar > dist )
            {
                bestDistSoFar = dist;
                somBest = node;
            }
        }
    } // end for y
    _assert( somBest !== null, 'Som best cannot be here null' );
    return somBest;
}
function som_DistBetweenNodes( n0, n1 )
{
    const y = Math.abs( n0.y - n1.y );
    const x = Math.abs( n0.x - n1.x );
    return Math.sqrt( y ) + Math.sqrt( x );
}

/////////////////////////////
const somSample = [
    [0,0,0],
    [1,0,0],
    [0,1,0],
    [0,0,1],
    [0,1,1],
    [1,1,0],
    [1,0,1],
    [1,1,1]
];

let somNumIterations = 1000;
let somIteration = 0;
let somLearningRate = 0.0000001;
const somMapRadius = Math.max( SOM_HEIGHT, SOM_WIDTH ) * 0.8;
const somTimeConst = somNumIterations / Math.log( somMapRadius );

let gTrainVectorID = 1;

function som_Epoch( som )
{
    if ( somNumIterations === 0 )
        return;

    gTrainVectorID++;
    gTrainVectorID = gTrainVectorID % somSample.length;

    let trainVectorID = rnd_Int( 0, somSample.length -1 );
    trainVectorID = gTrainVectorID;
    const somBMU = som_BMU( som, somSample[trainVectorID] );

    somIteration++;
    somNumIterations--;
    const neighRadiusSq = Math.sqrt( somMapRadius * Math.exp( -somIteration/somTimeConst ) );

    for ( let y = 0; y < SOM_HEIGHT; y++ )
    {
        for ( let x = 0; x < SOM_WIDTH; x++ )
        {
            const node = som[y][x];
            const distNodeSq = som_DistBetweenNodes( somBMU, node );
            if ( neighRadiusSq > distNodeSq )
            {
                const influence = Math.exp( -distNodeSq/(neighRadiusSq*2) );
                for ( let z = 0; z < SOM_DEPTH; z++ )
                {
                    node.z[z] += somLearningRate * influence * ( somSample[trainVectorID][z] - node.z[z] );
                }
            }
        } // end for x
    } // end for y
    somLearningRate = 0.09 * Math.exp( -somIteration/somNumIterations );
}

const som = som_Create();
som_Epoch( som );