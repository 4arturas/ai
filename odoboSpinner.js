var SPINNER_STATE_INIT = 0;
var SPINNER_STATE_WORKING = 1;
var SPINNER_STATE_STOPPED = 2;

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

var SPINNER_EFFECT_1 = 0;
var SPINNER_EFFECT_2 = 1;
var SPINNER_EFFECT_3 = 2;

var spinnerEffectType1 = SPINNER_EFFECT_1;
var spinnerEffectAngleStep1 = 0.1;
function odobo_SpinnerEffect1()
{
    var i;
    var obj;
    for ( i = 0; i < gOdoboSpinner.objectsArr.length; i++ )
    {
        obj = gOdoboSpinner.objectsArr[i];
        if ( spinnerEffectType1 == SPINNER_EFFECT_1 )
            obj.matrix = mat4x3_RotXX(gOdoboSpinner.angle);
        else if ( spinnerEffectType1 == SPINNER_EFFECT_2 )
            obj.matrix = mat4x3_RotYY(gOdoboSpinner.angle);
        else if ( spinnerEffectType1 == SPINNER_EFFECT_3 )
            obj.matrix = mat4x3_RotZZ(gOdoboSpinner.angle);

    } // end for i
    gOdoboSpinner.angle += spinnerEffectAngleStep1;
    if ( _abs( gOdoboSpinner.angle) > geomPI )
    {
        gOdoboSpinner.angle = 0.0;
        if ( spinnerEffectType1 == SPINNER_EFFECT_1 )
            spinnerEffectType1 = SPINNER_EFFECT_2;
        else if ( spinnerEffectType1 == SPINNER_EFFECT_2 )
            spinnerEffectType1 = SPINNER_EFFECT_3;
        else if ( spinnerEffectType1 == SPINNER_EFFECT_3 )
        {
            spinnerEffectType1 = SPINNER_EFFECT_1;
            spinnerEffectAngleStep1 -= (spinnerEffectAngleStep1*2.0);
        }
    } // end for i

    odobo_SpinnerSetXYZ();
    return 1;
}
var spinnerEffectType2;
function odobo_SpinnerEffect2()
{
    var i;
    var obj;

    switch ( gOdoboSpinner.state )
    {
        case SPINNER_STATE_INIT:
            gOdoboSpinner.state = SPINNER_STATE_WORKING;
            spinnerEffectType2 = new Array( gOdoboSpinner.objectsArr.length );
            for ( i = 0; i < spinnerEffectType2.length; i++ )
            {
                spinnerEffectType2[i] = i % 2;
//                spinnerEffectType2[i] = _randomInt(0, 2);
            }



            break;

        case SPINNER_STATE_WORKING:
            for ( i = 0; i < gOdoboSpinner.objectsArr.length; i++ )
            {
                obj = gOdoboSpinner.objectsArr[i];
                if ( spinnerEffectType2[i] == SPINNER_EFFECT_1 )
                    obj.matrix = mat4x3_RotXX(gOdoboSpinner.angle);
                else if ( spinnerEffectType2[i] == SPINNER_EFFECT_2 )
                    obj.matrix = mat4x3_RotYY(gOdoboSpinner.angle);
                else if ( spinnerEffectType2[i] == SPINNER_EFFECT_3 )
                    obj.matrix = mat4x3_RotZZ(gOdoboSpinner.angle);
            } // end for i
            gOdoboSpinner.angle += 0.1;
            break;
    } // end switch

    odobo_SpinnerSetXYZ();
    return 1;
}

var seekVehicle;
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
            gOdoboSpinner.state = SPINNER_STATE_WORKING;

            seekVehicle = vehicle_Create();
            seekVehicle.position = vec3D_Create( 0, 0, 0 );
            seekVehicle.velocity = vec3D_Create( 10.0, 10.0, 10.0 );
            seekVehicle.maxSpeed = 100.0;
            seekVehicle.mass = 1.0;
            seekVehicle.target = vec3D_Create( 300, 200, 500 );

            break;

        case SPINNER_STATE_WORKING:

            steering_Update( seekVehicle );
            obj.matrix = mat4x3_CreateIdentity();
            obj.matrix.tx = seekVehicle.position.x;
            obj.matrix.ty = seekVehicle.position.y;
            obj.matrix.tz = seekVehicle.position.z;


            var length = vec3D_Dist( seekVehicle.position, seekVehicle.target );
            if ( 12 > length )
                gOdoboSpinner.state = SPINNER_STATE_STOPPED;
            return 1;

        case SPINNER_STATE_STOPPED:
            _log( 'Arrived' );
            return 0;
    }
    return 1;
}


function odobo_Flee()
{
    return 0;
}