function som_Create( height, width, depth, stepY, stepX, ctx )
{
    var y, x, z;
    var som = {
        map: new Array( height*width )
    };
    var node;
    var weight;
    var c = 0;
    for ( y = 0; y < height; y++ )
    {
        for ( x = 0; x < width; x++ )
        {
            weight = new Array( depth );
            for ( z = 0; z < weight.length; z++ )
                weight[z] = _rnd_Real( 0, 1 );

            var fnVisualise = function()
            {
                var r = _floor(this.weight[0]*255.0);
                var g = _floor(this.weight[1]*255.0);
                var b = _floor(this.weight[2]*255.0);
                this.ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                this.ctx.fillRect( this.x*stepX, this.y*stepY, stepX, stepY );
            };
            var fnCircle = function()
            {
                this.ctx.strokeStyle = 'black';
                this.ctx.beginPath();
                this.ctx.arc( this.x*this.stepX+this.stepX*0.5, this.y*this.stepY+this.stepY*0.5, this.radius, 0, Math.PI*2, false );
                this.ctx.stroke();
            };
            node = {
                y: y, x: x,
                weight: weight,
                ctx: ctx,
                fnVisualise: fnVisualise, fnCircle: fnCircle,
                stepY:  stepY, stepX: stepX,
                radius: stepY*0.8
            };
            som.map[c++] = node;
        } // end for x
    } // end for y
    return som;
}
function som_Visualise( som )
{
    var y;
    var node;
    for ( y = 0; y < som.map.length; y++ )
    {
        node = som.map[y];
        node.fnVisualise();
    }
}
function som_CreateTrainData()
{
    var trainInp = [
        [1,0,0],
        [0,1,0],
        [0,0,1],
        [1,1,0],
        [1,0,1],
        [0,1,1],
        [1,1,1],
        [0,0,0]
    ];
    return trainInp;
}
function som_BMU( som, vec )
{
    var y, z;
    var dist, bestDist = Infinity;
    var node;
    var bmu = null;
    for ( y = 0; y < som.map.length; y++ )
    {
        node = som.map[y];
        dist = 0.0;
        for ( z = 0; z < vec.length; z++ )
            dist += _sqr( vec[z] - node.weight[z] );
        dist = _sqrt( dist );
        if ( bestDist > dist )
        {
            bestDist = dist;
            bmu = node;
        }
    } // end for y
    _assert( bmu!=null, 'som_BMU' );
    return bmu;
}
function som_Msg( msg )
{
    document.getElementById('somMsg').innerHTML = msg;
}
var SOM_HEIGHT = 32;
var SOM_WIDTH = 32;
var somNumEpoch = 1000;
var somEpoch = 0;
var somMapRadius = _max( SOM_HEIGHT, SOM_WIDTH ) * 0.8;
var somTimeConst = somNumEpoch / Math.log( somMapRadius );
var somLearningRate = 0.0000001;
var somTrainVecId = -1;
function som_Epoch( som, trainInp, epochNum, epoch )
{
    var y, z;
    var node, bmu;
    var vec;
    var neighRadius, neighRadiusSq;
    var distSQRT;
    var influence;
    var time = 0.0;
    var timeStep = 1.0;
    var msg;

    somTrainVecId++;
    somTrainVecId = somTrainVecId%trainInp.length;
    vec = trainInp[somTrainVecId];
    bmu = som_BMU( som, vec );

    neighRadius = somMapRadius * Math.exp( -epoch/somTimeConst );
    neighRadiusSq = neighRadius*neighRadius;

    for ( y = 0; y < som.map.length; y++ )
    {
        node = som.map[y];
        distSQRT = _sqr( _abs(node.y - bmu.y) ) + _sqr( _abs(node.x - bmu.x) );
        if ( neighRadiusSq > distSQRT )
        {
            influence = Math.exp( -distSQRT/(neighRadiusSq*2.0) );
            for ( z = 0; z < vec.length; z++ )
            {
                node.weight[z] += somLearningRate * influence * ( vec[z] - node.weight[z] );
            } // end for z

            //node.fnVisualise();
        }
    } // end for y

    somLearningRate = 0.09 * Math.exp(-epoch/epochNum);

    som_Visualise( som );
    for ( y = 0; y < trainInp.length; y++ )
    {
        bmu = som_BMU( som, trainInp[y] );
        bmu.radius = neighRadiusSq;
        bmu.fnCircle();
    }

    epochNum--;
    epoch++;

    msg = 'Epoch: ' + epoch;
    msg += '<br>learningRate: ' + somLearningRate;
    msg += '<br>neighRadius: ' + neighRadius;
    som_Msg( msg );

    //if ( epochNum == 0 ) return;
    if ( 1.5 > neighRadius ) return;

    setTimeout( function()
    {
        som_Epoch( som, trainInp, epochNum, epoch );
    }, 10 );
}
function som_EntryPoint()
{
    var somCanvas = document.getElementById('somCanvas');
    var ctx = somCanvas.getContext('2d');
    var canvasHeight = somCanvas.getAttribute('height')*1;
    var canvasWidth = somCanvas.getAttribute('width')*1;
    var mapHeight = SOM_HEIGHT;
    var mapWidth = SOM_WIDTH;
    var stepY = canvasHeight/mapHeight;
    var stepX = canvasWidth/mapWidth;
    var som = som_Create( mapHeight, mapWidth, 3, stepY, stepX, ctx );
    var trainInp = som_CreateTrainData();
    var bmu = som_BMU( som, trainInp[0] );
    som_Visualise( som );
    //bmu.fnCircle();

    som_Epoch( som, trainInp, somNumEpoch, 0 );
}
som_EntryPoint();
