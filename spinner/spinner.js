var SPINNER_STATE_INIT = 0;
var SPINNER_STATE_WORKING = 1;
var SPINNER_STATE_STOPPED = 2;



var SPINNER_EFFECT_1 = 0;
var SPINNER_EFFECT_2 = 1;
var SPINNER_EFFECT_3 = 2;

function spinner_Create( objectsArr )
{
    var i;
    var spinner = {
        state: SPINNER_STATE_INIT,
        animation: 1,
        framesCounter: 0,
        angle: 0.0,
        spinSpeed: 0,
        center: null,
        z: 500,

        objectsArr: objectsArr
    };

    odobo_ResetObjects();

    var h = 0;
    var rows, cols;
    i = 0;
    var color;
    for ( i = 0; i < spinner.objectsArr.length; i++ )
    {
        spinner.objectsArr[i].state = STATE_ON;
        spinner.objectsArr[i].attr = ATTR_2SIDE | ATTR_WIRED;
        if ( i >= 0 && 5 > i )
            color = gPixelRed;
        if ( i >= 5 && 10 > i )
            color = gPixelGreen;
        if ( i >= 10 && 15 > i )
            color = gPixelBlue;

        spinner.objectsArr[i].color = color;


    } // end for i

//            gEngine.objectsArr[i].color = gPixelRed;
    return spinner;
}

function odobo_SpinnerSetXYZ()
{
    var i;
    var start = -200;
    var x = start;
    var y = start+100;
    var step = 100;
    var obj;
    for ( i = 0; i < gEngine.numObjects; i++ )
    {
        obj = gOdoboSpinner.objectsArr[i];
        obj.matrix.tx = x;
        obj.matrix.ty = y;
        x += step;
        if ( (i+1) % 5 == 0 )
        {
            x = start;
            y += step;
        }

        obj.matrix.tz = gOdoboSpinner.z;
    } // end for i
}

function odobo_Spinner()
{
    odobo_SpinnerSetXYZ();
    return 1;
}