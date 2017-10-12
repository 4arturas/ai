var tableAnnealing = document.getElementById('tableAnnealing');
var infoAnnealing = document.getElementById('infoAnnealing');

var ANN_HEIGHT = 5;
var ANN_WIDTH = 5;

function rnd_Int( x, y )
{
    return Math.floor(
        Math.random() * ( y - 1 + 1 ) + x
    );
}

function rnd_Real( x, y )
{
    return Math.random() * ( y - x ) + x;
}

function log( l )
{
    console.log( l );
}

function ann_CreateRandom()
{
    var y, x;
    var box = new Array( ANN_HEIGHT );
    for ( y = 0; y < ANN_HEIGHT; y++ )
    {
        box[y] = new Array( ANN_WIDTH );
        for ( x = 0; x < ANN_WIDTH; x++ )
        {
            box[y][x] = 0;
        } // end for x
        x = rnd_Int( 0, ANN_WIDTH-1 );
        box[y][x] = 1;
    } // end for y
}

function ann_Change( box )
{
    var y, x;
    for ( y = 0; y < ANN_HEIGHT; y++ )
    {
        if ( 1 == rnd_Int(0,1) )
            continue;
        for ( x = 0; x < ANN_WIDTH; x++ )
        {
            box[y][x] = 0;
        } // end for x
        x = rnd_Int( 0, ANN_WIDTH-1 );
        box[y][x] = 1;
    } // end for y
}

function ann_TableInit()
{
    var y, x;
    var tr, td;

    while ( tableAnnealing.firstChild )
        tableAnnealing.removeChild( tableAnnealing.firstChild );

    for ( y = 0; y < ANN_HEIGHT; y++ )
    {
        tr = document.createElement('tr');
        tableAnnealing.appendChild( tr );
        for ( x = 0; x < ANN_WIDTH; x++ )
        {
            td = document.createElement('td');
            tr.appendChild( td );
            td.setAttribute('id', y + '_' + x );
        } // end for x
    } // end for y
}
ann_TableInit();

function ann_TableReset( box )
{
    var y, x;
    var tr, td;
    for ( y = 0; y < ANN_HEIGHT; y++ )
    {
        for ( x = 0; x < ANN_WIDTH; x++ )
        {
            td = document.getElementById(y+'_'+x);
            if ( box[y][x] == 1 )
                td.style.backgroundColor = 'black';
            else
                td.style.backgroundColor = 'white';
        } // end for x
    } // end for y
}

function ann_Energy( box )
{
    var energy = 0;
    var y, x, ty, tx;
    var i;
    //          N   S   E   W   NE  NW  SE  SW
    var dy = [ -1, +1, -0, +0, -1, -1, +1, +1 ];
    var dx = [ -0, +0, -1, +1, -1, +1, -1, +1 ];

    for ( y = 0; y < ANN_HEIGHT; y++ )
    {
        for ( x = 0; x < ANN_WIDTH; x++ )
        {
            if ( box[y][x] == 0 ) continue;

            for ( i = 0; i < dy.length; i++ )
            {
                ty = y;
                tx = x;
                while ( 1 == 1 )
                {
                    ty += dy[i];
                    tx += dx[i];
                    if ( 0 > ty || ty >= ANN_WIDTH ) break;
                    if ( 0 > tx || tx >= ANN_HEIGHT ) break;
                    energy += box[ty][tx];
                } // end while
            } // end for i
        } // end for x
    } // end for y
    return energy;
}

function ann_Copy( box )
{
    var y, x;
    var c;
    c = new Array( ANN_HEIGHT );
    for ( y = 0; y < ANN_HEIGHT; y++ )
    {
        c[y] = new Array( ANN_WIDTH );
        for ( x = 0; x < ANN_WIDTH; x++ )
        {
            c[y][x] = box[y][x];
        } // end for x
    } // end for y
    return c;
}

var annCurrent = ann_CreateRandom();
var annCurrentEnergy = ann_Energy( annCurrent );
log( annCurrentEnergy );
ann_TableReset( annCurrent );
var annTemeperature = 50.0;
function ann_Main()
{
    var stepsPerChange;
    var working;
    var workingEnergy;
    if ( 0.5 > annTemeperature )
        return;
    annTemeperature *= 0.99;

    for ( stepsPerChange = 0; stepsPerChange < 2; stepsPerChange++ )
    {
        working = ann_Copy( annCurrent );
        ann_Change( working );
        workingEnergy = ann_Energy( working );

        ann_TableReset( working );
        infoAnnealing.innerHTML = 'Temperature=' + annTemeperature;
        infoAnnealing.innerHTML += '<br>Current Energy=' + annCurrentEnergy;
        infoAnnealing.innerHTML += '<br>Working Energy=' + workingEnergy;
        if ( workingEnergy == 0 )
            return;

        if ( annCurrentEnergy > workingEnergy )
        {
            annCurrent = ann_Copy( working );
            annCurrentEnergy = workingEnergy;
            break;
        }

        var delta = workingEnergy - annCurrentEnergy;
        var temp = rnd_Real( 0, 1 );
        var calc = Math.exp( -delta/annTemeperature );
        if ( calc > temp )
        {
            annCurrentEnergy = ann_Copy( working );
            annCurrentEnergy = workingEnergy;
            break;
        }
    } // end for stepsPerChange
    setTimeout( function() { ann_Main(); }, 100 );
}
ann_Main();