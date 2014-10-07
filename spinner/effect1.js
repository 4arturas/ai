var spinnerEffectType1 = SPINNER_EFFECT_1;
var spinnerEffectAngleStep1 = 0.1;
function spinner_Effect_1()
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