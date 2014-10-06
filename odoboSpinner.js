var SPINNER_STATE_INIT = 0;
var SPINNER_STATE_WORKING = 1;
var SPINNER_STATE_STOP = 2;

function odoboSpinner_Create( objectsArr )
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

        objectsArr: objectsArr,


        // seek
        seekPos: null,
        seekVelocity: null,
        seekMaxVelocity: 0,
        seekTarget: null
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

function odobo_Spinner()
{
    if ( gOdoboSpinner.framesCounter++ > 1000 ) return 0;

    var i;
    var start = -200;
    var x = start;
    var y = start;
    var step = 100;
    for ( i = 0; i < gEngine.numObjects; i++ )
    {
        gOdoboSpinner.objectsArr[i].matrix = mat4x3_RotXX( gOdoboSpinner.angle );
        gOdoboSpinner.objectsArr[i].matrix.tx = x;
        gOdoboSpinner.objectsArr[i].matrix.ty = y;
        x += step;
        if ( (i+1) % 5 == 0 )
        {
            x = start;
            y += step;
        }

        gOdoboSpinner.objectsArr[i].matrix.tz = gOdoboSpinner.z;
    } // end for i

    if ( gOdoboSpinner.framesCounter > 0 )
        gOdoboSpinner.angle += 0.1;
    if ( gOdoboSpinner.framesCounter > 100 )
        gOdoboSpinner.angle += 0.1;
    if ( gOdoboSpinner.framesCounter > 400 )
        gOdoboSpinner.angle -= 0.1;
    if ( gOdoboSpinner.framesCounter > 600 )
        gOdoboSpinner.angle -= 0.1;

    return 1;
}

function odobo_Seek()
{
//    http://gamedevelopment.tutsplus.com/series/understanding-steering-behaviors--gamedev-12732
    var obj;
    odobo_ResetObjects();
    obj = gOdoboSpinner.objectsArr[0];
    obj.state = STATE_ON;
    obj.attr = ATTR_2SIDE | ATTR_WIRED;
    switch ( gOdoboSpinner.state )
    {

        case SPINNER_STATE_INIT:
            gOdoboSpinner.seekPos = vec3D_Create( 0, 0, 0 );
            gOdoboSpinner.seekMaxVelocity = 0.01;
            gOdoboSpinner.seekTarget = vec3D_Create( 30, 0, 0 );
            gOdoboSpinner.seekVelocity = vec3D_Create( 0.9, 0.9, 0 );
            gOdoboSpinner.state = SPINNER_STATE_WORKING;
            break;

        case SPINNER_STATE_WORKING:

            obj.matrix.tx = gOdoboSpinner.seekPos.x;
            obj.matrix.ty = gOdoboSpinner.seekPos.y;
            obj.matrix.tz = gOdoboSpinner.seekPos.z;

            gOdoboSpinner.seekVelocity = vec3D_Sub( gOdoboSpinner.seekTarget, gOdoboSpinner.seekPos );
            gOdoboSpinner.seekVelocity = vec3D_MulScalar( gOdoboSpinner.seekVelocity, 0.05 );
            gOdoboSpinner.seekPos = vec3D_Add( gOdoboSpinner.seekPos, gOdoboSpinner.seekVelocity );
            var length = vec3D_Dist( gOdoboSpinner.seekPos, gOdoboSpinner.seekTarget );
            if ( 1 > length )
                gOdoboSpinner.state = SPINNER_STATE_STOP;
            break;

        case SPINNER_STATE_STOP:
            obj = gOdoboSpinner.objectsArr[0];
            obj.matrix.tx = gOdoboSpinner.seekPos.x;
            obj.matrix.ty = gOdoboSpinner.seekPos.y;
            obj.matrix.tz = gOdoboSpinner.seekPos.z;
            _log( 'Arrived' );
            return 0;
    }


    return 1;
}