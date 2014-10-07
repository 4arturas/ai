var spinnerEffect3_Type;
var spinnerEffect3_Angle;
var spinnerEffect3_AngleStep = 0.2;
var spinnerEffect3_AngleStepArr;
function spinner_Effect_3_SetStep()
{
    var r = _randomInt( 0, 1 );
    if ( r == 0 )
        return spinnerEffect3_AngleStep;
    return -spinnerEffect3_AngleStep;
}
function spinner_Effect_3()
{
    var i;
    var obj;

    switch ( gOdoboSpinner.state )
    {
        case SPINNER_STATE_INIT:
            gOdoboSpinner.state = SPINNER_STATE_WORKING;
            spinnerEffect3_Type = new Array( gOdoboSpinner.objectsArr.length );
            spinnerEffect3_Angle = new Array( gOdoboSpinner.objectsArr.length );
            spinnerEffect3_AngleStepArr = new Array( gOdoboSpinner.objectsArr.length );
            for ( i = 0; i < spinnerEffect3_Type.length; i++ )
            {
                spinnerEffect3_Type[i] = -1;
                spinnerEffect3_Angle[i] = 0.0;
                spinnerEffect3_AngleStepArr[i] = spinnerEffect3_AngleStep;
//                spinnerEffect3_Type[i] = _randomInt(0, 2);
            }
            break;

        case SPINNER_STATE_WORKING:
            for ( i = 0; i < gOdoboSpinner.objectsArr.length; i++ )
            {
                obj = gOdoboSpinner.objectsArr[i];

                if ( spinnerEffect3_Type[i] == -1 ) // 1. if effect is not set
                {
                    var r = _randomInt( 0, 50 );
                    if ( r == 1 )
                    {
                        spinnerEffect3_Type[i] = SPINNER_EFFECT_1;
                        spinnerEffect3_AngleStepArr[i] = spinner_Effect_3_SetStep();
                    }
                    else if ( r == 2 )
                    {
                        spinnerEffect3_Type[i] = SPINNER_EFFECT_2;
                        spinnerEffect3_AngleStepArr[i] = spinner_Effect_3_SetStep();
                    }
                    else if ( r == 3 )
                    {
                        spinnerEffect3_Type[i] = SPINNER_EFFECT_3;
                        spinnerEffect3_AngleStepArr[i] = spinner_Effect_3_SetStep();
                    }
                } // end if 1.

                else // if effect is set
                {
                    var angle = spinnerEffect3_Angle[i];
                    if (spinnerEffect3_Type[i] == SPINNER_EFFECT_1)
                        obj.matrix = mat4x3_RotXX( angle );
                    else if (spinnerEffect3_Type[i] == SPINNER_EFFECT_2)
                        obj.matrix = mat4x3_RotYY( angle );
                    else if (spinnerEffect3_Type[i] == SPINNER_EFFECT_3)
                        obj.matrix = mat4x3_RotZZ( angle );
                } /// end else

                spinnerEffect3_Angle[i] += spinnerEffect3_AngleStepArr[i];
                if ( _abs( spinnerEffect3_Angle[i] )  > geomPI )
                {
                    spinnerEffect3_Angle[i] = 0;
                    spinnerEffect3_Type[i] = -1;
                    obj.matrix = mat4x3_CreateIdentity();
                }

            } // end for i

            break;
    } // end switch

    odobo_SpinnerSetXYZ();
    return 1;
}