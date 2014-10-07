var spinnerEffectType1 = SPINNER_EFFECT_1;
var spinnerEffectAngleStep1 = 0.1;
function spinner_Effect_1()
{
    var i;
    var obj;
    for ( i = 0; i < gSpinner.objectsArr.length; i++ )
    {
        obj = gSpinner.objectsArr[i];
        if ( spinnerEffectType1 == SPINNER_EFFECT_1 )
            obj.matrix = mat4x3_RotXX(gSpinner.angle);
        else if ( spinnerEffectType1 == SPINNER_EFFECT_2 )
            obj.matrix = mat4x3_RotYY(gSpinner.angle);
        else if ( spinnerEffectType1 == SPINNER_EFFECT_3 )
            obj.matrix = mat4x3_RotZZ(gSpinner.angle);

    } // end for i
    gSpinner.angle += spinnerEffectAngleStep1;
    if ( _abs( gSpinner.angle) > geomPI )
    {
        gSpinner.angle = 0.0;
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

    odobo_SpinnerSetXYZ( gSpinner.objectsArr );
    return 1;
}