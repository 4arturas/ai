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
        framesCounter: 0,
        center: null,
        z: 500,

        objectsArr: objectsArr,

        effectTypeArr: null,
        angle: null,
        angleStep: null,
        angleStepArr: null,
        sequanceArr: null
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

function odobo_SpinnerCreateHome( arrLength, z )
{
    var i;
    var start = -200;
    var x = start;
    var y = start+100;
    var step = 100;
    var homeArr = new Array( arrLength );
    for ( i = 0; i < arrLength; i++ )
    {
        homeArr[i] = vec3D_Create( x, y, z );
        x += step;
        if ( (i+1) % 5 == 0 )
        {
            x = start;
            y += step;
        }
    } // end for i
    return homeArr;
}

function odobo_SpinnerSetXYZ( objectsArr )
{
    var i;
    var home;
    var obj;
    var homeArr = odobo_SpinnerCreateHome( objectsArr.length, gSpinner.z );
    for ( i = 0; i < objectsArr.length; i++ )
    {
        home = homeArr[i];
        obj = objectsArr[i];
        obj.matrix.tx = home.x;
        obj.matrix.ty = home.y;
        obj.matrix.tz = home.z;
    } // end for i
}

function odobo_Spinner()
{
    odobo_SpinnerSetXYZ( gSpinner.objectsArr );
    return 1;
}