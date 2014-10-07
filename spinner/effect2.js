
var spinnerEffectType2;
var spinnerEffectAngleStep2 = 0.1;
function spinner_Effect_2()
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
            gOdoboSpinner.angle += spinnerEffectAngleStep2;

            if ( _abs( gOdoboSpinner.angle )  > geomPI2 )
                spinnerEffectAngleStep2 -= (spinnerEffectAngleStep2*2.0);
            break;
    } // end switch

    odobo_SpinnerSetXYZ( gOdoboSpinner.objectsArr );
    return 1;
}