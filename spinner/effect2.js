
var spinnerEffectType2;
var spinnerEffectAngleStep2 = 0.1;
function spinner_Effect_2()
{
    var i;
    var obj;

    switch ( gSpinner.state )
    {
        case SPINNER_STATE_INIT:
            gSpinner.state = SPINNER_STATE_WORKING;
            spinnerEffectType2 = new Array( gSpinner.objectsArr.length );
            for ( i = 0; i < spinnerEffectType2.length; i++ )
            {
                spinnerEffectType2[i] = i % 2;
//                spinnerEffectType2[i] = _randomInt(0, 2);
            }



            break;

        case SPINNER_STATE_WORKING:
            for ( i = 0; i < gSpinner.objectsArr.length; i++ )
            {
                obj = gSpinner.objectsArr[i];
                if ( spinnerEffectType2[i] == SPINNER_EFFECT_1 )
                    obj.matrix = mat4x3_RotXX(gSpinner.angle);
                else if ( spinnerEffectType2[i] == SPINNER_EFFECT_2 )
                    obj.matrix = mat4x3_RotYY(gSpinner.angle);
                else if ( spinnerEffectType2[i] == SPINNER_EFFECT_3 )
                    obj.matrix = mat4x3_RotZZ(gSpinner.angle);
            } // end for i
            gSpinner.angle += spinnerEffectAngleStep2;

            if ( _abs( gSpinner.angle )  > geomPI2 )
                spinnerEffectAngleStep2 -= (spinnerEffectAngleStep2*2.0);
            break;
    } // end switch

    odobo_SpinnerSetXYZ( gSpinner.objectsArr );
    return 1;
}